package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.FriendRequestResponse;
import com.myclass.chat_app.dto.GroupInvitationResponse;
import com.myclass.chat_app.dto.SocialStateResponse;
import com.myclass.chat_app.dto.UserResponse;
import com.myclass.chat_app.entity.ChatGroup;
import com.myclass.chat_app.entity.FriendRequest;
import com.myclass.chat_app.entity.GroupInvitation;
import com.myclass.chat_app.entity.GroupMember;
import com.myclass.chat_app.entity.GroupRole;
import com.myclass.chat_app.entity.InvitationStatus;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.FriendRequestRepository;
import com.myclass.chat_app.repository.GroupInvitationRepository;
import com.myclass.chat_app.repository.GroupMemberRepository;
import com.myclass.chat_app.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class SocialService {

    private final FriendRequestRepository friendRequestRepository;
    private final GroupInvitationRepository groupInvitationRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final TransientCollaborationStore transientStore;
    private final TransactionTemplate transactionTemplate;

    public SocialService(
            FriendRequestRepository friendRequestRepository,
            GroupInvitationRepository groupInvitationRepository,
            GroupMemberRepository groupMemberRepository,
            UserRepository userRepository,
            TransientCollaborationStore transientStore,
            TransactionTemplate transactionTemplate
    ) {
        this.friendRequestRepository = friendRequestRepository;
        this.groupInvitationRepository = groupInvitationRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
        this.transientStore = transientStore;
        this.transactionTemplate = transactionTemplate;
    }

    public SocialStateResponse getState(String currentUserEmail) {
        String email = normalizeRequiredEmail(currentUserEmail);
        try {
            List<UserResponse> friends = listFriendsFromDatabase(email);
            List<FriendRequestResponse> incoming = friendRequestRepository
                    .findByRecipientEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(email, InvitationStatus.PENDING)
                    .stream()
                    .map(this::toFriendRequestResponse)
                    .toList();
            List<FriendRequestResponse> outgoing = friendRequestRepository
                    .findByRequesterEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(email, InvitationStatus.PENDING)
                    .stream()
                    .map(this::toFriendRequestResponse)
                    .toList();
            List<GroupInvitationResponse> invitations = groupInvitationRepository
                    .findByInvitedUserEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(email, InvitationStatus.PENDING)
                    .stream()
                    .map(this::toGroupInvitationResponse)
                    .toList();
            return new SocialStateResponse(friends, incoming, outgoing, invitations);
        } catch (RuntimeException exception) {
            return transientStore.getSocialState(email);
        }
    }

    public FriendRequestResponse sendFriendRequest(String requesterEmail, String recipientEmail) {
        String requester = normalizeRequiredEmail(requesterEmail);
        String recipient = normalizeRequiredEmail(recipientEmail);
        validateFriendRequestEmails(requester, recipient);

        try {
            return transactionTemplate.execute(status -> sendFriendRequestInDatabase(requester, recipient));
        } catch (RuntimeException exception) {
            return transientStore.sendFriendRequest(requester, recipient);
        }
    }

    public FriendRequestResponse acceptFriendRequest(Long requestId, String currentUserEmail) {
        return respondToFriendRequest(requestId, currentUserEmail, InvitationStatus.ACCEPTED);
    }

    public FriendRequestResponse declineFriendRequest(Long requestId, String currentUserEmail) {
        return respondToFriendRequest(requestId, currentUserEmail, InvitationStatus.DECLINED);
    }

    public GroupInvitationResponse acceptGroupInvitation(Long invitationId, String currentUserEmail) {
        return respondToGroupInvitation(invitationId, currentUserEmail, InvitationStatus.ACCEPTED);
    }

    public GroupInvitationResponse declineGroupInvitation(Long invitationId, String currentUserEmail) {
        return respondToGroupInvitation(invitationId, currentUserEmail, InvitationStatus.DECLINED);
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

        try {
            return friendRequestRepository.findBetweenUsers(first, second).stream()
                    .anyMatch(request -> request.getStatus() == InvitationStatus.ACCEPTED);
        } catch (RuntimeException exception) {
            return transientStore.areFriends(first, second);
        }
    }

    private FriendRequestResponse sendFriendRequestInDatabase(String requesterEmail, String recipientEmail) {
        User requester = loadOrCreateUser(requesterEmail);
        User recipient = loadOrCreateUser(recipientEmail);

        List<FriendRequest> existing = friendRequestRepository.findBetweenUsers(requesterEmail, recipientEmail);
        if (existing.stream().anyMatch(request -> request.getStatus() == InvitationStatus.ACCEPTED)) {
            throw new IllegalArgumentException("You are already friends.");
        }
        if (existing.stream().anyMatch(request -> request.getStatus() == InvitationStatus.PENDING)) {
            throw new IllegalArgumentException("A friend request is already pending between these accounts.");
        }

        FriendRequest request = new FriendRequest();
        request.setRequester(requester);
        request.setRecipient(recipient);
        request.setStatus(InvitationStatus.PENDING);
        return toFriendRequestResponse(friendRequestRepository.save(request));
    }

    private FriendRequestResponse respondToFriendRequest(Long requestId, String currentUserEmail, InvitationStatus decision) {
        String email = normalizeRequiredEmail(currentUserEmail);
        if (requestId == null) {
            throw new IllegalArgumentException("Friend request was not found.");
        }

        try {
            return transactionTemplate.execute(status -> {
                FriendRequest request = friendRequestRepository.findById(requestId)
                        .orElseThrow(() -> new IllegalArgumentException("Friend request was not found."));
                if (!email.equalsIgnoreCase(request.getRecipient().getEmail())) {
                    throw new IllegalArgumentException("Only the invited user can respond to this friend request.");
                }
                if (request.getStatus() != InvitationStatus.PENDING) {
                    throw new IllegalArgumentException("This friend request was already handled.");
                }
                request.setStatus(decision);
                request.setRespondedAt(Instant.now());
                return toFriendRequestResponse(friendRequestRepository.save(request));
            });
        } catch (RuntimeException exception) {
            return transientStore.respondToFriendRequest(requestId, email, decision);
        }
    }

    private GroupInvitationResponse respondToGroupInvitation(Long invitationId, String currentUserEmail, InvitationStatus decision) {
        String email = normalizeRequiredEmail(currentUserEmail);
        if (invitationId == null) {
            throw new IllegalArgumentException("Group invitation was not found.");
        }

        try {
            return transactionTemplate.execute(status -> {
                GroupInvitation invitation = groupInvitationRepository.findById(invitationId)
                        .orElseThrow(() -> new IllegalArgumentException("Group invitation was not found."));
                if (!email.equalsIgnoreCase(invitation.getInvitedUser().getEmail())) {
                    throw new IllegalArgumentException("Only the invited user can respond to this group invitation.");
                }
                if (invitation.getStatus() != InvitationStatus.PENDING) {
                    throw new IllegalArgumentException("This group invitation was already handled.");
                }

                invitation.setStatus(decision);
                invitation.setRespondedAt(Instant.now());

                if (decision == InvitationStatus.ACCEPTED) {
                    ensureMembership(invitation.getGroup(), invitation.getInvitedUser());
                }

                return toGroupInvitationResponse(groupInvitationRepository.save(invitation));
            });
        } catch (RuntimeException exception) {
            return transientStore.respondToGroupInvitation(invitationId, email, decision);
        }
    }

    private List<UserResponse> listFriendsFromDatabase(String email) {
        Map<String, UserResponse> friends = new LinkedHashMap<>();
        for (FriendRequest request : friendRequestRepository.findConnections(email, InvitationStatus.ACCEPTED)) {
            User other = request.getRequester().getEmail().equalsIgnoreCase(email)
                    ? request.getRecipient()
                    : request.getRequester();
            friends.putIfAbsent(other.getEmail().toLowerCase(Locale.ROOT), toUserResponse(other));
        }
        return List.copyOf(friends.values());
    }

    private void ensureMembership(ChatGroup group, User invitedUser) {
        Optional<GroupMember> existingMembership = groupMemberRepository
                .findByGroupIdAndUserEmailIgnoreCase(group.getId(), invitedUser.getEmail());
        if (existingMembership.isPresent()) {
            return;
        }

        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(invitedUser);
        member.setRole(GroupRole.MEMBER);
        groupMemberRepository.save(member);
    }

    private User loadOrCreateUser(String email) {
        return userRepository.findByEmailIgnoreCase(email).orElseGet(() -> {
            User user = new User();
            user.setEmail(email);
            user.setFullName(defaultDisplayName(email));
            return userRepository.save(user);
        });
    }

    private FriendRequestResponse toFriendRequestResponse(FriendRequest request) {
        return new FriendRequestResponse(
                request.getId(),
                request.getRequester().getEmail(),
                displayName(request.getRequester()),
                request.getRecipient().getEmail(),
                displayName(request.getRecipient()),
                request.getStatus().name(),
                request.getCreatedAt()
        );
    }

    private GroupInvitationResponse toGroupInvitationResponse(GroupInvitation invitation) {
        return new GroupInvitationResponse(
                invitation.getId(),
                invitation.getGroup().getId(),
                invitation.getGroup().getName(),
                invitation.getGroup().getCategory(),
                invitation.getInvitedBy().getEmail(),
                displayName(invitation.getInvitedBy()),
                invitation.getStatus().name(),
                invitation.getCreatedAt()
        );
    }

    private UserResponse toUserResponse(User user) {
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
        String fullName = user.getFullName();
        if (fullName != null && !fullName.isBlank()) {
            return fullName.trim();
        }
        return defaultDisplayName(user.getEmail());
    }

    private String defaultDisplayName(String email) {
        if (email == null || email.isBlank()) {
            return "User";
        }
        int atIndex = email.indexOf('@');
        return atIndex > 0 ? email.substring(0, atIndex) : email;
    }

    private void validateFriendRequestEmails(String requester, String recipient) {
        if (requester.equals(recipient)) {
            throw new IllegalArgumentException("You cannot send a friend request to yourself.");
        }
    }

    private String normalizeRequiredEmail(String email) {
        String normalized = normalizeEmail(email);
        if (normalized == null) {
            throw new IllegalArgumentException("Unauthorized");
        }
        return normalized;
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        return normalized.isBlank() ? null : normalized;
    }
}
