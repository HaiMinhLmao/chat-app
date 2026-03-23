package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.CreateGroupRequest;
import com.myclass.chat_app.dto.FriendRequestResponse;
import com.myclass.chat_app.dto.GroupSummaryResponse;
import com.myclass.chat_app.dto.SocialStateResponse;
import com.myclass.chat_app.entity.ChatGroup;
import com.myclass.chat_app.entity.FriendRequest;
import com.myclass.chat_app.entity.GroupInvitation;
import com.myclass.chat_app.entity.InvitationStatus;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.ChatGroupRepository;
import com.myclass.chat_app.repository.FriendRequestRepository;
import com.myclass.chat_app.repository.GroupInvitationRepository;
import com.myclass.chat_app.repository.GroupMemberRepository;
import com.myclass.chat_app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SocialServiceTest {

    @Test
    void sendFriendRequestFallsBackToTransientStoreWhenDatabaseWriteFails() {
        FriendRequestRepository friendRequestRepository = mock(FriendRequestRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        GroupMemberRepository groupMemberRepository = mock(GroupMemberRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        TransactionTemplate transactionTemplate = mock(TransactionTemplate.class);
        TransientCollaborationStore transientStore = new TransientCollaborationStore();
        User recipient = user("bob@example.com", "Bob", 2L);

        when(friendRequestRepository.findBetweenUsers("alice@example.com", "bob@example.com")).thenReturn(List.of());
        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase("bob@example.com")).thenReturn(Optional.of(recipient));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0, User.class);
            user.setId(1L);
            return user;
        });
        when(friendRequestRepository.save(any())).thenThrow(new RuntimeException("database unavailable"));
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<Object> callback = transactionCallback(invocation);
            return callback.doInTransaction(null);
        });

        SocialService service = new SocialService(
                friendRequestRepository,
                groupInvitationRepository,
                groupMemberRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );
        transientStore.upsertUser("bob@example.com", "Bob");

        FriendRequestResponse response = service.sendFriendRequest("alice@example.com", "bob@example.com");

        assertThat(response.requesterEmail()).isEqualTo("alice@example.com");
        assertThat(response.recipientEmail()).isEqualTo("bob@example.com");
        assertThat(transientStore.getSocialState("alice@example.com").outgoingFriendRequests()).hasSize(1);
    }

    @Test
    void getStateMergesTransientFriendRequestsWhenDatabaseReadsReturnEmpty() {
        FriendRequestRepository friendRequestRepository = mock(FriendRequestRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        GroupMemberRepository groupMemberRepository = mock(GroupMemberRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        TransactionTemplate transactionTemplate = mock(TransactionTemplate.class);
        TransientCollaborationStore transientStore = new TransientCollaborationStore();
        User recipient = user("bob@gmail.com", "Bob", 2L);

        when(friendRequestRepository.findBetweenUsers("alice@gmail.com", "bob@gmail.com")).thenReturn(List.of());
        when(friendRequestRepository.findConnections("bob@gmail.com", com.myclass.chat_app.entity.InvitationStatus.ACCEPTED))
                .thenReturn(List.of());
        when(friendRequestRepository.findByRecipientEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                "bob@gmail.com",
                com.myclass.chat_app.entity.InvitationStatus.PENDING
        )).thenReturn(List.of());
        when(friendRequestRepository.findByRequesterEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                "bob@gmail.com",
                com.myclass.chat_app.entity.InvitationStatus.PENDING
        )).thenReturn(List.of());
        when(groupInvitationRepository.findByInvitedUserEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                "bob@gmail.com",
                com.myclass.chat_app.entity.InvitationStatus.PENDING
        )).thenReturn(List.of());
        when(userRepository.findByEmailIgnoreCase("alice@gmail.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase("bob@gmail.com")).thenReturn(Optional.of(recipient));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0, User.class);
            if (user.getId() == null) {
                user.setId(user.getEmail().startsWith("alice") ? 1L : 2L);
            }
            return user;
        });
        when(friendRequestRepository.save(any())).thenThrow(new RuntimeException("database unavailable"));
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<Object> callback = transactionCallback(invocation);
            return callback.doInTransaction(null);
        });

        SocialService service = new SocialService(
                friendRequestRepository,
                groupInvitationRepository,
                groupMemberRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );
        transientStore.upsertUser("bob@gmail.com", "Bob");

        service.sendFriendRequest("alice@gmail.com", "bob@gmail.com");

        SocialStateResponse state = service.getState("bob@gmail.com");

        assertThat(state.incomingFriendRequests())
                .extracting(FriendRequestResponse::requesterEmail)
                .containsExactly("alice@gmail.com");
    }

    @Test
    void sendFriendRequestRejectsUnknownWorkspaceEmail() {
        FriendRequestRepository friendRequestRepository = mock(FriendRequestRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        GroupMemberRepository groupMemberRepository = mock(GroupMemberRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        TransactionTemplate transactionTemplate = mock(TransactionTemplate.class);
        TransientCollaborationStore transientStore = new TransientCollaborationStore();

        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase("ghost@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0, User.class);
            user.setId(1L);
            return user;
        });
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<Object> callback = transactionCallback(invocation);
            return callback.doInTransaction(null);
        });

        SocialService service = new SocialService(
                friendRequestRepository,
                groupInvitationRepository,
                groupMemberRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );

        assertThatThrownBy(() -> service.sendFriendRequest("alice@example.com", "ghost@example.com"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("No MyClassRoom account found for ghost@example.com.");
    }

    @Test
    void getStateIncludesDatabaseFriendRequestsInRecipientsInbox() {
        FriendRequestRepository friendRequestRepository = mock(FriendRequestRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        GroupMemberRepository groupMemberRepository = mock(GroupMemberRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        TransactionTemplate transactionTemplate = mock(TransactionTemplate.class);
        TransientCollaborationStore transientStore = new TransientCollaborationStore();
        User requester = user("alice@example.com", "Alice", 1L);
        User recipient = user("bob@example.com", "Bob", 2L);
        List<FriendRequest> savedRequests = new ArrayList<>();

        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.of(requester));
        when(userRepository.findByEmailIgnoreCase("bob@example.com")).thenReturn(Optional.of(recipient));
        when(friendRequestRepository.findBetweenUsers("alice@example.com", "bob@example.com"))
                .thenAnswer(invocation -> List.copyOf(savedRequests));
        when(friendRequestRepository.save(any(FriendRequest.class))).thenAnswer(invocation -> {
            FriendRequest request = invocation.getArgument(0, FriendRequest.class);
            request.setId(10L);
            savedRequests.add(request);
            return request;
        });
        when(friendRequestRepository.findConnections("bob@example.com", InvitationStatus.ACCEPTED)).thenReturn(List.of());
        when(friendRequestRepository.findByRecipientEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                "bob@example.com",
                InvitationStatus.PENDING
        )).thenAnswer(invocation -> List.copyOf(savedRequests));
        when(friendRequestRepository.findByRequesterEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                "bob@example.com",
                InvitationStatus.PENDING
        )).thenReturn(List.of());
        when(groupInvitationRepository.findByInvitedUserEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                "bob@example.com",
                InvitationStatus.PENDING
        )).thenReturn(List.of());
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<Object> callback = transactionCallback(invocation);
            return callback.doInTransaction(null);
        });

        SocialService service = new SocialService(
                friendRequestRepository,
                groupInvitationRepository,
                groupMemberRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );

        service.sendFriendRequest("alice@example.com", "bob@example.com");

        SocialStateResponse state = service.getState("bob@example.com");

        assertThat(state.incomingFriendRequests())
                .extracting(FriendRequestResponse::requesterEmail)
                .containsExactly("alice@example.com");
    }

    @Test
    void getStateIncludesDatabaseGroupInvitationsInRecipientsInbox() {
        FriendRequestRepository friendRequestRepository = mock(FriendRequestRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        GroupMemberRepository groupMemberRepository = mock(GroupMemberRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        TransactionTemplate transactionTemplate = mock(TransactionTemplate.class);
        TransientCollaborationStore transientStore = new TransientCollaborationStore();
        User inviter = user("creator@example.com", "Creator", 1L);
        User invitedUser = user("friend@example.com", "Friend", 2L);

        ChatGroup group = new ChatGroup();
        group.setId(9L);
        group.setName("DBI202 Study Group");
        group.setCategory("DBI202");

        GroupInvitation invitation = new GroupInvitation();
        invitation.setId(40L);
        invitation.setGroup(group);
        invitation.setInvitedBy(inviter);
        invitation.setInvitedUser(invitedUser);
        invitation.setStatus(InvitationStatus.PENDING);

        when(friendRequestRepository.findConnections("friend@example.com", InvitationStatus.ACCEPTED)).thenReturn(List.of());
        when(friendRequestRepository.findByRecipientEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                "friend@example.com",
                InvitationStatus.PENDING
        )).thenReturn(List.of());
        when(friendRequestRepository.findByRequesterEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                "friend@example.com",
                InvitationStatus.PENDING
        )).thenReturn(List.of());
        when(groupInvitationRepository.findByInvitedUserEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(
                "friend@example.com",
                InvitationStatus.PENDING
        )).thenReturn(List.of(invitation));

        SocialService service = new SocialService(
                friendRequestRepository,
                groupInvitationRepository,
                groupMemberRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );

        SocialStateResponse state = service.getState("friend@example.com");

        assertThat(state.groupInvitations())
                .extracting(invite -> invite.groupName() + "@" + invite.invitedByEmail())
                .containsExactly("DBI202 Study Group@creator@example.com");
    }

    @Test
    void acceptingTransientGroupInvitationAddsTheGroupToInviteesWorkspace() {
        ChatGroupRepository groupRepository = mock(ChatGroupRepository.class);
        GroupMemberRepository groupMemberRepository = mock(GroupMemberRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        FriendRequestRepository friendRequestRepository = mock(FriendRequestRepository.class);
        TransactionTemplate transactionTemplate = mock(TransactionTemplate.class);
        TransientCollaborationStore transientStore = new TransientCollaborationStore();

        User creator = new User();
        creator.setId(1L);
        creator.setEmail("creator@example.com");
        creator.setFullName("Creator");

        User invitedUser = new User();
        invitedUser.setId(2L);
        invitedUser.setEmail("friend@example.com");
        invitedUser.setFullName("Friend");

        when(userRepository.findByEmailIgnoreCase("creator@example.com")).thenReturn(Optional.of(creator));
        when(userRepository.findByEmailIgnoreCase("friend@example.com")).thenReturn(Optional.of(invitedUser));
        when(groupRepository.save(any(ChatGroup.class))).thenThrow(new RuntimeException("database unavailable"));
        when(groupInvitationRepository.findByInvitedUserEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(any(), any()))
                .thenThrow(new RuntimeException("database unavailable"));
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<Object> callback = transactionCallback(invocation);
            return callback.doInTransaction(null);
        });

        GroupService groupService = new GroupService(
                groupRepository,
                groupMemberRepository,
                groupInvitationRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );

        SocialService socialService = new SocialService(
                friendRequestRepository,
                groupInvitationRepository,
                groupMemberRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );
        transientStore.upsertUser("friend@example.com", "Friend");

        groupService.createGroup(
                "creator@example.com",
                new CreateGroupRequest("DBI202 Study Group", "Database prep", "DBI202", List.of("friend@example.com"))
        );

        Long invitationId = socialService.getState("friend@example.com").groupInvitations().get(0).id();
        socialService.acceptGroupInvitation(invitationId, "friend@example.com");

        List<GroupSummaryResponse> groups = groupService.listMyGroups("friend@example.com");

        assertThat(groups).extracting(GroupSummaryResponse::name).containsExactly("DBI202 Study Group");
    }

    private static User user(String email, String fullName, Long id) {
        User user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setFullName(fullName);
        return user;
    }

    @SuppressWarnings("unchecked")
    private static TransactionCallback<Object> transactionCallback(org.mockito.invocation.InvocationOnMock invocation) {
        return (TransactionCallback<Object>) invocation.getArgument(0, TransactionCallback.class);
    }
}
