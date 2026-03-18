package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.CreateGroupRequest;
import com.myclass.chat_app.dto.GroupResponse;
import com.myclass.chat_app.dto.GroupSummaryResponse;
import com.myclass.chat_app.entity.GroupRole;
import com.myclass.chat_app.entity.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.regex.Pattern;

@Service
public class TransientCollaborationStore {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$", Pattern.CASE_INSENSITIVE);

    private final AtomicLong userIdSequence = new AtomicLong(10_000);
    private final AtomicLong groupIdSequence = new AtomicLong(10_000);
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final Map<Long, StoredGroup> groupsById = new ConcurrentHashMap<>();

    public User upsertUser(String email, String fullName) {
        String normalized = normalizeEmail(email);
        if (normalized == null) {
            throw new IllegalArgumentException("Email is required");
        }

        return usersByEmail.compute(normalized, (key, existing) -> {
            User user = existing != null ? existing : new User();
            if (user.getId() == null) {
                user.setId(userIdSequence.incrementAndGet());
            }
            user.setEmail(normalized);
            if (fullName != null && !fullName.isBlank()) {
                user.setFullName(fullName.trim());
            } else if (user.getFullName() == null || user.getFullName().isBlank()) {
                user.setFullName(defaultDisplayName(normalized));
            }
            if (user.getCreatedAt() == null) {
                user.setCreatedAt(Instant.now());
            }
            return user;
        });
    }

    public Optional<User> findUserByEmail(String email) {
        String normalized = normalizeEmail(email);
        if (normalized == null) {
            return Optional.empty();
        }
        return Optional.ofNullable(usersByEmail.get(normalized));
    }

    public List<User> listUsers() {
        return usersByEmail.values().stream()
                .sorted((left, right) -> left.getEmail().compareToIgnoreCase(right.getEmail()))
                .toList();
    }

    public synchronized GroupResponse createGroup(String creatorEmail, CreateGroupRequest request) {
        String creator = normalizeEmail(creatorEmail);
        if (creator == null) {
            throw new IllegalArgumentException("Unauthorized");
        }
        if (request == null || request.groupName() == null || request.groupName().isBlank()) {
            throw new IllegalArgumentException("groupName is required");
        }

        upsertUser(creator, null);

        long groupId = groupIdSequence.incrementAndGet();
        Instant createdAt = Instant.now();
        LinkedHashMap<String, GroupRole> members = new LinkedHashMap<>();
        members.put(creator, GroupRole.ADMIN);

        for (String email : normalizeEmails(request.members())) {
            if (email.equals(creator) || !isValidEmail(email)) {
                continue;
            }
            upsertUser(email, null);
            members.put(email, GroupRole.MEMBER);
        }

        StoredGroup group = new StoredGroup(
                groupId,
                request.groupName().trim(),
                trimToNull(request.description()),
                trimToNull(request.category()),
                creator,
                createdAt,
                members
        );
        groupsById.put(groupId, group);
        return toResponse(group);
    }

    public GroupResponse getGroup(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Group not found");
        }
        StoredGroup group = groupsById.get(id);
        if (group == null) {
            throw new IllegalArgumentException("Group not found");
        }
        return toResponse(group);
    }

    public List<GroupSummaryResponse> listMyGroups(String email) {
        String normalized = normalizeEmail(email);
        if (normalized == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        return groupsById.values().stream()
                .filter(group -> group.members().containsKey(normalized))
                .sorted((a, b) -> b.createdAt().compareTo(a.createdAt()))
                .map(group -> new GroupSummaryResponse(
                        group.id(),
                        group.name(),
                        group.category(),
                        group.members().get(normalized).name()
                ))
                .toList();
    }

    public boolean isMember(Long groupId, String email) {
        String normalized = normalizeEmail(email);
        if (groupId == null || normalized == null) {
            return false;
        }
        StoredGroup group = groupsById.get(groupId);
        return group != null && group.members().containsKey(normalized);
    }

    public boolean isAdmin(Long groupId, String email) {
        String normalized = normalizeEmail(email);
        if (groupId == null || normalized == null) {
            return false;
        }
        StoredGroup group = groupsById.get(groupId);
        return group != null && group.members().get(normalized) == GroupRole.ADMIN;
    }

    private GroupResponse toResponse(StoredGroup group) {
        List<GroupResponse.GroupMemberResponse> members = new ArrayList<>();
        for (Map.Entry<String, GroupRole> entry : group.members().entrySet()) {
            members.add(new GroupResponse.GroupMemberResponse(entry.getKey(), entry.getValue().name()));
        }
        return new GroupResponse(
                group.id(),
                group.name(),
                group.description(),
                group.category(),
                group.createdByEmail(),
                group.createdAt(),
                members
        );
    }

    private static Set<String> normalizeEmails(List<String> emails) {
        Set<String> out = new LinkedHashSet<>();
        if (emails == null) {
            return out;
        }
        for (String raw : emails) {
            if (raw == null) {
                continue;
            }
            for (String part : raw.split(",")) {
                String normalized = normalizeEmail(part);
                if (normalized != null) {
                    out.add(normalized);
                }
            }
        }
        return out;
    }

    private static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    private static String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        return normalized.isBlank() ? null : normalized;
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

    private record StoredGroup(
            Long id,
            String name,
            String description,
            String category,
            String createdByEmail,
            Instant createdAt,
            LinkedHashMap<String, GroupRole> members
    ) {
    }
}
