package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.CreateGroupRequest;
import com.myclass.chat_app.dto.GroupResponse;
import com.myclass.chat_app.dto.GroupSummaryResponse;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.entity.ChatGroup;
import com.myclass.chat_app.entity.GroupMember;
import com.myclass.chat_app.entity.GroupRole;
import com.myclass.chat_app.repository.ChatGroupRepository;
import com.myclass.chat_app.repository.GroupMemberRepository;
import com.myclass.chat_app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class GroupService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", Pattern.CASE_INSENSITIVE);

    private final ChatGroupRepository groupRepository;
    private final GroupMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final TransientCollaborationStore transientStore;
    private final TransactionTemplate transactionTemplate;

    public GroupService(
            ChatGroupRepository groupRepository,
            GroupMemberRepository memberRepository,
            UserRepository userRepository,
            TransientCollaborationStore transientStore,
            TransactionTemplate transactionTemplate
    ) {
        this.groupRepository = groupRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.transientStore = transientStore;
        this.transactionTemplate = transactionTemplate;
    }

    public GroupResponse createGroup(String creatorEmail, CreateGroupRequest request) {
        if (creatorEmail == null || creatorEmail.isBlank()) {
            throw new IllegalArgumentException("Unauthorized");
        }
        String creator = creatorEmail.trim().toLowerCase(Locale.ROOT);
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }

        String groupName = request.groupName();
        if (groupName == null || groupName.isBlank()) {
            throw new IllegalArgumentException("groupName is required");
        }

        try {
            return transactionTemplate.execute(status -> createGroupInDatabase(creator, request));
        } catch (IllegalArgumentException e) {
            if ("Creator user not found in local DB".equalsIgnoreCase(e.getMessage())) {
                return transientStore.createGroup(creator, request);
            }
            throw e;
        } catch (RuntimeException e) {
            return transientStore.createGroup(creator, request);
        }
    }

    private GroupResponse createGroupInDatabase(String creator, CreateGroupRequest request) {
        User createdBy = userRepository.findByEmailIgnoreCase(creator)
                .orElseThrow(() -> new IllegalArgumentException("Creator user not found in local DB"));

        ChatGroup group = new ChatGroup();
        group.setName(request.groupName().trim());
        group.setDescription(trimToNull(request.description()));
        group.setCategory(trimToNull(request.category()));
        group.setCreatedBy(createdBy);

        ChatGroup savedGroup = groupRepository.save(group);

        GroupMember adminMember = new GroupMember();
        adminMember.setGroup(savedGroup);
        adminMember.setUser(createdBy);
        adminMember.setRole(GroupRole.ADMIN);
        memberRepository.save(adminMember);

        Set<String> uniqueEmails = normalizeEmails(request.members());
        uniqueEmails.remove(creator);

        List<GroupMember> added = new ArrayList<>();
        for (String email : uniqueEmails) {
            if (!isValidEmail(email)) continue;
            User u = loadOrCreateInvitedUser(email);
            GroupMember gm = new GroupMember();
            gm.setGroup(savedGroup);
            gm.setUser(u);
            gm.setRole(GroupRole.MEMBER);
            added.add(memberRepository.save(gm));
        }

        return toResponse(savedGroup, adminMember, added);
    }

    private User loadOrCreateInvitedUser(String email) {
        return userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            User invitedUser = new User();
            invitedUser.setEmail(email);
            invitedUser.setFullName(defaultDisplayName(email));
            return userRepository.save(invitedUser);
        });
    }

    @Transactional(readOnly = true)
    public GroupResponse getGroup(Long id) {
        if (id == null) throw new IllegalArgumentException("Group not found");
        try {
            ChatGroup group = groupRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Group not found"));
            List<GroupMember> members = memberRepository.findByGroupId(id);
            return new GroupResponse(
                    group.getId(),
                    group.getName(),
                    group.getDescription(),
                    group.getCategory(),
                    group.getCreatedBy().getEmail(),
                    group.getCreatedAt(),
                    members.stream()
                            .map(m -> new GroupResponse.GroupMemberResponse(m.getUser().getEmail(), m.getRole().name()))
                            .toList()
            );
        } catch (IllegalArgumentException e) {
            return transientStore.getGroup(id);
        } catch (RuntimeException e) {
            return transientStore.getGroup(id);
        }
    }

    @Transactional(readOnly = true)
    public List<GroupSummaryResponse> listMyGroups(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Unauthorized");
        }
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        List<GroupSummaryResponse> transientGroups = transientStore.listMyGroups(normalized);
        try {
            List<GroupMember> memberships = memberRepository.findByUserEmailIgnoreCase(normalized);
            List<GroupSummaryResponse> databaseGroups = memberships.stream()
                    .map(m -> new GroupSummaryResponse(
                            m.getGroup().getId(),
                            m.getGroup().getName(),
                            m.getGroup().getCategory(),
                            m.getRole().name()
                    ))
                    .toList();
            return mergeGroups(transientGroups, databaseGroups);
        } catch (RuntimeException ignored) {
            // Fall back to transient storage below.
        }
        return transientGroups;
    }

    @Transactional(readOnly = true)
    public boolean isMember(Long groupId, String email) {
        if (groupId == null || email == null || email.isBlank()) return false;
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        try {
            if (memberRepository.findByGroupIdAndUserEmailIgnoreCase(groupId, normalized).isPresent()) {
                return true;
            }
        } catch (RuntimeException ignored) {
            // Fall back to transient storage below.
        }
        return transientStore.isMember(groupId, normalized);
    }

    @Transactional(readOnly = true)
    public boolean isAdmin(Long groupId, String email) {
        if (groupId == null || email == null || email.isBlank()) return false;
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        try {
            Optional<GroupMember> membership = memberRepository.findByGroupIdAndUserEmailIgnoreCase(groupId, normalized);
            if (membership.isPresent()) {
                return membership.get().getRole() == GroupRole.ADMIN;
            }
        } catch (RuntimeException ignored) {
            // Fall back to transient storage below.
        }
        return transientStore.isAdmin(groupId, normalized);
    }

    private static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    private static Set<String> normalizeEmails(List<String> emails) {
        Set<String> out = new LinkedHashSet<>();
        if (emails == null) return out;
        for (String raw : emails) {
            if (raw == null) continue;
            // allow comma-separated
            for (String part : raw.split(",")) {
                String e = part.trim().toLowerCase(Locale.ROOT);
                if (!e.isBlank()) out.add(e);
            }
        }
        return out;
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static String defaultDisplayName(String email) {
        int index = email.indexOf('@');
        return index > 0 ? email.substring(0, index) : email;
    }

    private static List<GroupSummaryResponse> mergeGroups(
            List<GroupSummaryResponse> transientGroups,
            List<GroupSummaryResponse> databaseGroups
    ) {
        Map<Long, GroupSummaryResponse> merged = new LinkedHashMap<>();
        for (GroupSummaryResponse group : transientGroups) {
            merged.put(group.id(), group);
        }
        for (GroupSummaryResponse group : databaseGroups) {
            merged.putIfAbsent(group.id(), group);
        }
        return new ArrayList<>(merged.values());
    }

    private GroupResponse toResponse(ChatGroup group, GroupMember admin, List<GroupMember> added) {
        List<GroupResponse.GroupMemberResponse> members = new ArrayList<>();
        members.add(new GroupResponse.GroupMemberResponse(admin.getUser().getEmail(), admin.getRole().name()));
        for (GroupMember m : added) {
            members.add(new GroupResponse.GroupMemberResponse(m.getUser().getEmail(), m.getRole().name()));
        }

        return new GroupResponse(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getCategory(),
                group.getCreatedBy().getEmail(),
                group.getCreatedAt(),
                members
        );
    }
}

