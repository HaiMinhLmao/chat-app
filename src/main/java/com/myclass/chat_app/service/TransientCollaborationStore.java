package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.CreateGroupRequest;
import com.myclass.chat_app.dto.FriendRequestResponse;
import com.myclass.chat_app.dto.GroupInvitationResponse;
import com.myclass.chat_app.dto.GroupResponse;
import com.myclass.chat_app.dto.GroupSummaryResponse;
import com.myclass.chat_app.dto.SocialStateResponse;
import com.myclass.chat_app.dto.UserResponse;
import com.myclass.chat_app.entity.GroupRole;
import com.myclass.chat_app.entity.InvitationStatus;
import com.myclass.chat_app.entity.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
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
    private final AtomicLong friendRequestIdSequence = new AtomicLong(20_000);
    private final AtomicLong groupInvitationIdSequence = new AtomicLong(30_000);

    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final Map<Long, StoredGroup> groupsById = new ConcurrentHashMap<>();
    private final Map<Long, StoredFriendRequest> friendRequestsById = new ConcurrentHashMap<>();
    private final Map<Long, StoredGroupInvitation> groupInvitationsById = new ConcurrentHashMap<>();

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
                .sorted(Comparator.comparing(User::getEmail, String.CASE_INSENSITIVE_ORDER))
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

        for (String email : normalizeEmails(request.members())) {
            if (email.equals(creator) || !isValidEmail(email)) {
                continue;
            }
            upsertUser(email, null);
            long invitationId = groupInvitationIdSequence.incrementAndGet();
            groupInvitationsById.put(
                    invitationId,
                    new StoredGroupInvitation(
                            invitationId,
                            groupId,
                            creator,
                            email,
                            InvitationStatus.PENDING,
                            createdAt,
                            null
                    )
            );
        }

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
                .sorted((left, right) -> right.createdAt().compareTo(left.createdAt()))
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

    public synchronized FriendRequestResponse sendFriendRequest(String requesterEmail, String recipientEmail) {
        String requester = normalizeEmail(requesterEmail);
        String recipient = normalizeEmail(recipientEmail);
        if (requester == null || recipient == null) {
            throw new IllegalArgumentException("Both emails are required.");
        }
        if (requester.equals(recipient)) {
            throw new IllegalArgumentException("You cannot send a friend request to yourself.");
        }
        if (areFriends(requester, recipient)) {
            throw new IllegalArgumentException("You are already friends.");
        }

        boolean hasPendingRequest = friendRequestsById.values().stream().anyMatch(request ->
                request.status() == InvitationStatus.PENDING && samePair(request, requester, recipient));
        if (hasPendingRequest) {
            throw new IllegalArgumentException("A friend request is already pending between these accounts.");
        }

        upsertUser(requester, null);
        upsertUser(recipient, null);

        long requestId = friendRequestIdSequence.incrementAndGet();
        StoredFriendRequest request = new StoredFriendRequest(
                requestId,
                requester,
                recipient,
                InvitationStatus.PENDING,
                Instant.now(),
                null
        );
        friendRequestsById.put(requestId, request);
        return toFriendRequestResponse(request);
    }

    public synchronized FriendRequestResponse respondToFriendRequest(Long requestId, String currentUserEmail, InvitationStatus decision) {
        String email = normalizeEmail(currentUserEmail);
        if (requestId == null || email == null) {
            throw new IllegalArgumentException("Friend request was not found.");
        }
        StoredFriendRequest request = friendRequestsById.get(requestId);
        if (request == null) {
            throw new IllegalArgumentException("Friend request was not found.");
        }
        if (!email.equals(request.recipientEmail())) {
            throw new IllegalArgumentException("Only the invited user can respond to this friend request.");
        }
        if (request.status() != InvitationStatus.PENDING) {
            throw new IllegalArgumentException("This friend request was already handled.");
        }

        StoredFriendRequest updated = new StoredFriendRequest(
                request.id(),
                request.requesterEmail(),
                request.recipientEmail(),
                decision,
                request.createdAt(),
                Instant.now()
        );
        friendRequestsById.put(requestId, updated);
        return toFriendRequestResponse(updated);
    }

    public synchronized GroupInvitationResponse respondToGroupInvitation(Long invitationId, String currentUserEmail, InvitationStatus decision) {
        String email = normalizeEmail(currentUserEmail);
        if (invitationId == null || email == null) {
            throw new IllegalArgumentException("Group invitation was not found.");
        }
        StoredGroupInvitation invitation = groupInvitationsById.get(invitationId);
        if (invitation == null) {
            throw new IllegalArgumentException("Group invitation was not found.");
        }
        if (!email.equals(invitation.invitedUserEmail())) {
            throw new IllegalArgumentException("Only the invited user can respond to this group invitation.");
        }
        if (invitation.status() != InvitationStatus.PENDING) {
            throw new IllegalArgumentException("This group invitation was already handled.");
        }

        StoredGroupInvitation updated = new StoredGroupInvitation(
                invitation.id(),
                invitation.groupId(),
                invitation.invitedByEmail(),
                invitation.invitedUserEmail(),
                decision,
                invitation.createdAt(),
                Instant.now()
        );
        groupInvitationsById.put(invitationId, updated);

        if (decision == InvitationStatus.ACCEPTED) {
            StoredGroup group = groupsById.get(invitation.groupId());
            if (group != null) {
                group.members().putIfAbsent(email, GroupRole.MEMBER);
            }
        }

        return toGroupInvitationResponse(updated);
    }

    public SocialStateResponse getSocialState(String currentUserEmail) {
        String email = normalizeEmail(currentUserEmail);
        if (email == null) {
            throw new IllegalArgumentException("Unauthorized");
        }

        List<UserResponse> friends = friendRequestsById.values().stream()
                .filter(request -> request.status() == InvitationStatus.ACCEPTED)
                .filter(request -> request.requesterEmail().equals(email) || request.recipientEmail().equals(email))
                .sorted((left, right) -> right.createdAt().compareTo(left.createdAt()))
                .map(request -> request.requesterEmail().equals(email) ? request.recipientEmail() : request.requesterEmail())
                .distinct()
                .map(this::toUserResponse)
                .toList();

        List<FriendRequestResponse> incoming = friendRequestsById.values().stream()
                .filter(request -> request.status() == InvitationStatus.PENDING)
                .filter(request -> request.recipientEmail().equals(email))
                .sorted((left, right) -> right.createdAt().compareTo(left.createdAt()))
                .map(this::toFriendRequestResponse)
                .toList();

        List<FriendRequestResponse> outgoing = friendRequestsById.values().stream()
                .filter(request -> request.status() == InvitationStatus.PENDING)
                .filter(request -> request.requesterEmail().equals(email))
                .sorted((left, right) -> right.createdAt().compareTo(left.createdAt()))
                .map(this::toFriendRequestResponse)
                .toList();

        List<GroupInvitationResponse> invitations = groupInvitationsById.values().stream()
                .filter(invitation -> invitation.status() == InvitationStatus.PENDING)
                .filter(invitation -> invitation.invitedUserEmail().equals(email))
                .sorted((left, right) -> right.createdAt().compareTo(left.createdAt()))
                .map(this::toGroupInvitationResponse)
                .toList();

        return new SocialStateResponse(friends, incoming, outgoing, invitations);
    }

    public boolean areFriends(String firstEmail, String secondEmail) {
        String first = normalizeEmail(firstEmail);
        String second = normalizeEmail(secondEmail);
        if (first == null || second == null) {
            return false;
        }
        if (first.equals(second)) {
            return true;
        }
        return friendRequestsById.values().stream()
                .anyMatch(request -> request.status() == InvitationStatus.ACCEPTED && samePair(request, first, second));
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

    private FriendRequestResponse toFriendRequestResponse(StoredFriendRequest request) {
        User requester = upsertUser(request.requesterEmail(), null);
        User recipient = upsertUser(request.recipientEmail(), null);
        return new FriendRequestResponse(
                request.id(),
                request.requesterEmail(),
                displayName(requester),
                request.recipientEmail(),
                displayName(recipient),
                request.status().name(),
                request.createdAt()
        );
    }

    private GroupInvitationResponse toGroupInvitationResponse(StoredGroupInvitation invitation) {
        StoredGroup group = groupsById.get(invitation.groupId());
        User invitedBy = upsertUser(invitation.invitedByEmail(), null);
        return new GroupInvitationResponse(
                invitation.id(),
                invitation.groupId(),
                group != null ? group.name() : "Study Group",
                group != null ? group.category() : "",
                invitation.invitedByEmail(),
                displayName(invitedBy),
                invitation.status().name(),
                invitation.createdAt()
        );
    }

    private UserResponse toUserResponse(String email) {
        User user = upsertUser(email, null);
        return new UserResponse(
                user.getId(),
                displayName(user),
                user.getEmail(),
                user.getFullName()
        );
    }

    private String displayName(User user) {
        if (user == null) {
            return "User";
        }
        if (user.getFullName() != null && !user.getFullName().isBlank()) {
            return user.getFullName().trim();
        }
        return defaultDisplayName(user.getEmail());
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

    private static boolean samePair(StoredFriendRequest request, String first, String second) {
        return (request.requesterEmail().equals(first) && request.recipientEmail().equals(second))
                || (request.requesterEmail().equals(second) && request.recipientEmail().equals(first));
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

    private record StoredFriendRequest(
            Long id,
            String requesterEmail,
            String recipientEmail,
            InvitationStatus status,
            Instant createdAt,
            Instant respondedAt
    ) {
    }

    private record StoredGroupInvitation(
            Long id,
            Long groupId,
            String invitedByEmail,
            String invitedUserEmail,
            InvitationStatus status,
            Instant createdAt,
            Instant respondedAt
    ) {
    }
}
