package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.CreateGroupRequest;
import com.myclass.chat_app.dto.GroupResponse;
import com.myclass.chat_app.dto.GroupSummaryResponse;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.entity.ChatGroup;
import com.myclass.chat_app.entity.GroupMember;
import com.myclass.chat_app.entity.GroupInvitation;
import com.myclass.chat_app.entity.InvitationStatus;
import com.myclass.chat_app.entity.GroupRole;
import com.myclass.chat_app.repository.ChatGroupRepository;
import com.myclass.chat_app.repository.GroupInvitationRepository;
import com.myclass.chat_app.repository.GroupMemberRepository;
import com.myclass.chat_app.repository.UserRepository;
import com.myclass.chat_app.support.UserIdentitySupport;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

@Service
public class GroupService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", Pattern.CASE_INSENSITIVE);

    private final ChatGroupRepository groupRepository;
    private final GroupMemberRepository memberRepository;
    private final GroupInvitationRepository groupInvitationRepository;
    private final UserRepository userRepository;
    private final TransientCollaborationStore transientStore;
    private final TransactionTemplate transactionTemplate;

    public GroupService(
            ChatGroupRepository groupRepository,
            GroupMemberRepository memberRepository,
            GroupInvitationRepository groupInvitationRepository,
            UserRepository userRepository,
            TransientCollaborationStore transientStore,
            TransactionTemplate transactionTemplate
    ) {
        this.groupRepository = groupRepository;
        this.memberRepository = memberRepository;
        this.groupInvitationRepository = groupInvitationRepository;
        this.userRepository = userRepository;
        this.transientStore = transientStore;
        this.transactionTemplate = transactionTemplate;
    }

    public GroupResponse createGroup(String creatorEmail, CreateGroupRequest request) {
        String creator = UserIdentitySupport.normalizeEmail(creatorEmail);
        if (creator == null) {
            throw new IllegalArgumentException("Unauthorized");
        }
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }

        String groupName = UserIdentitySupport.trimToNull(request.groupName());
        if (groupName == null) {
            throw new IllegalArgumentException("groupName is required");
        }

        try {
            return transactionTemplate.execute(status -> createGroupInDatabase(creator, request));
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (RuntimeException e) {
            return transientStore.createGroup(creator, request);
        }
    }

    private GroupResponse createGroupInDatabase(String creator, CreateGroupRequest request) {
        User createdBy = loadOrCreateCreator(creator);
        Set<String> uniqueEmails = normalizeEmails(request.members());
        uniqueEmails.remove(creator);
        List<User> invitedUsers = resolveInvitedUsers(uniqueEmails);

        ChatGroup group = new ChatGroup();
        group.setName(UserIdentitySupport.trimToNull(request.groupName()));
        group.setDescription(UserIdentitySupport.trimToNull(request.description()));
        group.setCategory(UserIdentitySupport.trimToNull(request.category()));
        group.setCreatedBy(createdBy);

        ChatGroup savedGroup = groupRepository.save(group);

        GroupMember adminMember = new GroupMember();
        adminMember.setGroup(savedGroup);
        adminMember.setUser(createdBy);
        adminMember.setRole(GroupRole.ADMIN);
        memberRepository.save(adminMember);

        for (User invitedUser : invitedUsers) {
            GroupInvitation invitation = new GroupInvitation();
            invitation.setGroup(savedGroup);
            invitation.setInvitedBy(createdBy);
            invitation.setInvitedUser(invitedUser);
            invitation.setStatus(InvitationStatus.PENDING);
            groupInvitationRepository.save(invitation);
        }

        return new GroupResponse(
                savedGroup.getId(),
                savedGroup.getName(),
                savedGroup.getDescription(),
                savedGroup.getCategory(),
                savedGroup.getCreatedBy().getEmail(),
                savedGroup.getCreatedAt(),
                List.of(toMemberResponse(adminMember))
        );
    }

    private User loadOrCreateCreator(String email) {
        return userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            User creator = new User();
            creator.setEmail(email);
            creator.setFullName(UserIdentitySupport.defaultDisplayName(email));
            return userRepository.save(creator);
        });
    }

    private List<User> resolveInvitedUsers(Set<String> emails) {
        List<String> invalidEmails = emails.stream()
                .filter(email -> !isValidEmail(email))
                .toList();
        if (!invalidEmails.isEmpty()) {
            throw new IllegalArgumentException(invalidInviteEmailMessage(invalidEmails));
        }

        List<User> invitedUsers = new ArrayList<>();
        List<String> missingEmails = new ArrayList<>();
        for (String email : emails) {
            userRepository.findByEmailIgnoreCase(email)
                    .ifPresentOrElse(invitedUsers::add, () -> missingEmails.add(email));
        }

        if (!missingEmails.isEmpty()) {
            throw new IllegalArgumentException(missingAccountMessage(missingEmails));
        }
        return invitedUsers;
    }

    @Transactional(readOnly = true)
    public GroupResponse getGroup(Long id, String requesterEmail) {
        String requester = requireRequesterEmail(requesterEmail);
        if (id == null) throw new IllegalArgumentException("Group not found");
        try {
            ChatGroup group = groupRepository.findById(id).orElse(null);
            if (group != null) {
                if (memberRepository.findByGroupIdAndUserEmailIgnoreCase(id, requester).isEmpty()) {
                    throw new SecurityException("You are not a member of this group.");
                }
                return toGroupResponse(group, memberRepository.findByGroupId(id));
            }
        } catch (SecurityException e) {
            throw e;
        } catch (RuntimeException e) {
            try {
                return transientStore.getGroup(id, requester);
            } catch (IllegalArgumentException | SecurityException fallbackFailure) {
                throw e;
            }
        }
        return transientStore.getGroup(id, requester);
    }

    public GroupResponse renameGroup(Long groupId, String requesterEmail, String nextName) {
        String requester = requireRequesterEmail(requesterEmail);
        String normalizedName = UserIdentitySupport.trimToNull(nextName);
        if (normalizedName == null) {
            throw new IllegalArgumentException("groupName is required");
        }
        if (groupId == null) {
            throw new IllegalArgumentException("Group not found");
        }

        try {
            ChatGroup group = groupRepository.findById(groupId).orElse(null);
            if (group != null) {
                return transactionTemplate.execute(status -> renameGroupInDatabase(groupId, requester, normalizedName));
            }
        } catch (IllegalArgumentException | SecurityException e) {
            throw e;
        } catch (RuntimeException e) {
            try {
                return transientStore.renameGroup(groupId, requester, normalizedName);
            } catch (IllegalArgumentException | SecurityException fallbackFailure) {
                throw e;
            }
        }
        return transientStore.renameGroup(groupId, requester, normalizedName);
    }

    public GroupResponse removeMember(Long groupId, String requesterEmail, String memberEmail) {
        String requester = requireRequesterEmail(requesterEmail);
        String targetEmail = UserIdentitySupport.normalizeEmail(memberEmail);
        if (targetEmail == null) {
            throw new IllegalArgumentException("Member email is required");
        }
        if (groupId == null) {
            throw new IllegalArgumentException("Group not found");
        }

        try {
            ChatGroup group = groupRepository.findById(groupId).orElse(null);
            if (group != null) {
                return transactionTemplate.execute(status -> removeMemberInDatabase(groupId, requester, targetEmail));
            }
        } catch (IllegalArgumentException | SecurityException e) {
            throw e;
        } catch (RuntimeException e) {
            try {
                return transientStore.removeMember(groupId, requester, targetEmail);
            } catch (IllegalArgumentException | SecurityException fallbackFailure) {
                throw e;
            }
        }
        return transientStore.removeMember(groupId, requester, targetEmail);
    }

    public void leaveGroup(Long groupId, String requesterEmail) {
        String requester = requireRequesterEmail(requesterEmail);
        if (groupId == null) {
            throw new IllegalArgumentException("Group not found");
        }

        try {
            ChatGroup group = groupRepository.findById(groupId).orElse(null);
            if (group != null) {
                transactionTemplate.executeWithoutResult(status -> leaveGroupInDatabase(groupId, requester));
                return;
            }
        } catch (IllegalArgumentException | SecurityException e) {
            throw e;
        } catch (RuntimeException e) {
            try {
                transientStore.leaveGroup(groupId, requester);
                return;
            } catch (IllegalArgumentException | SecurityException fallbackFailure) {
                throw e;
            }
        }
        transientStore.leaveGroup(groupId, requester);
    }

    @Transactional(readOnly = true)
    public List<GroupSummaryResponse> listMyGroups(String email) {
        String normalized = UserIdentitySupport.normalizeEmail(email);
        if (normalized == null) {
            throw new IllegalArgumentException("Unauthorized");
        }
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
        String normalized = UserIdentitySupport.normalizeEmail(email);
        if (groupId == null || normalized == null) return false;
        try {
            if (memberRepository.findByGroupIdAndUserEmailIgnoreCase(groupId, normalized).isPresent()) {
                return true;
            }
        } catch (RuntimeException ignored) {
            // Fall back to transient storage below.
        }
        return transientStore.isMember(groupId, normalized);
    }

    private GroupResponse renameGroupInDatabase(Long groupId, String requester, String nextName) {
        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
        requireGroupCreator(group, requester);
        group.setName(nextName);
        ChatGroup savedGroup = groupRepository.save(group);
        return toGroupResponse(savedGroup, memberRepository.findByGroupId(groupId));
    }

    private GroupResponse removeMemberInDatabase(Long groupId, String requester, String targetEmail) {
        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));
        requireGroupCreator(group, requester);

        String creatorEmail = UserIdentitySupport.normalizeEmail(group.getCreatedBy().getEmail());
        if (targetEmail.equals(creatorEmail)) {
            throw new IllegalArgumentException("The group creator cannot be removed.");
        }

        GroupMember member = memberRepository.findByGroupIdAndUserEmailIgnoreCase(groupId, targetEmail)
                .orElseThrow(() -> new IllegalArgumentException("Member not found."));
        memberRepository.delete(member);
        memberRepository.flush();
        return toGroupResponse(group, memberRepository.findByGroupId(groupId));
    }

    private void leaveGroupInDatabase(Long groupId, String requester) {
        ChatGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new IllegalArgumentException("Group not found"));

        String creatorEmail = UserIdentitySupport.normalizeEmail(group.getCreatedBy().getEmail());
        if (requester.equals(creatorEmail)) {
            throw new IllegalArgumentException("The group creator cannot leave this group.");
        }

        GroupMember membership = memberRepository.findByGroupIdAndUserEmailIgnoreCase(groupId, requester)
                .orElseThrow(() -> new SecurityException("You are not a member of this group."));
        memberRepository.delete(membership);
        memberRepository.flush();
    }

    private static String requireRequesterEmail(String email) {
        String normalized = UserIdentitySupport.normalizeEmail(email);
        if (normalized == null) {
            throw new SecurityException("Unauthorized");
        }
        return normalized;
    }

    private static void requireGroupCreator(ChatGroup group, String requesterEmail) {
        String creatorEmail = UserIdentitySupport.normalizeEmail(group.getCreatedBy().getEmail());
        if (!requesterEmail.equals(creatorEmail)) {
            throw new SecurityException("Only the group creator can manage this group.");
        }
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
                String e = UserIdentitySupport.normalizeEmail(part);
                if (e != null) out.add(e);
            }
        }
        return out;
    }

    private static String invalidInviteEmailMessage(List<String> emails) {
        return emails.size() == 1
                ? "Invalid invite email: " + emails.get(0) + "."
                : "Invalid invite emails: " + String.join(", ", emails) + ".";
    }

    private static String missingAccountMessage(List<String> emails) {
        return "Not found.";
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

    private static GroupResponse toGroupResponse(ChatGroup group, List<GroupMember> members) {
        return new GroupResponse(
                group.getId(),
                group.getName(),
                group.getDescription(),
                group.getCategory(),
                group.getCreatedBy().getEmail(),
                group.getCreatedAt(),
                members.stream()
                        .sorted(Comparator
                                .comparing((GroupMember member) -> member.getRole() != GroupRole.ADMIN)
                                .thenComparing(member -> member.getUser().getEmail(), String.CASE_INSENSITIVE_ORDER))
                        .map(GroupService::toMemberResponse)
                        .toList()
        );
    }

    private static GroupResponse.GroupMemberResponse toMemberResponse(GroupMember member) {
        return new GroupResponse.GroupMemberResponse(member.getUser().getEmail(), member.getRole().name());
    }
}

