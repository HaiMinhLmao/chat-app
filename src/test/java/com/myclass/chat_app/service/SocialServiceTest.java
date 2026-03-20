package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.CreateGroupRequest;
import com.myclass.chat_app.dto.FriendRequestResponse;
import com.myclass.chat_app.dto.GroupSummaryResponse;
import com.myclass.chat_app.entity.ChatGroup;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.ChatGroupRepository;
import com.myclass.chat_app.repository.FriendRequestRepository;
import com.myclass.chat_app.repository.GroupInvitationRepository;
import com.myclass.chat_app.repository.GroupMemberRepository;
import com.myclass.chat_app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
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

        when(friendRequestRepository.findBetweenUsers("alice@example.com", "bob@example.com")).thenReturn(List.of());
        when(userRepository.findByEmailIgnoreCase("alice@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase("bob@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(1L);
            return user;
        });
        when(friendRequestRepository.save(any())).thenThrow(new RuntimeException("database unavailable"));
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<?> callback = invocation.getArgument(0);
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

        FriendRequestResponse response = service.sendFriendRequest("alice@example.com", "bob@example.com");

        assertThat(response.requesterEmail()).isEqualTo("alice@example.com");
        assertThat(response.recipientEmail()).isEqualTo("bob@example.com");
        assertThat(transientStore.getSocialState("alice@example.com").outgoingFriendRequests()).hasSize(1);
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

        when(userRepository.findByEmailIgnoreCase("creator@example.com")).thenReturn(Optional.of(creator));
        when(groupRepository.save(any(ChatGroup.class))).thenThrow(new RuntimeException("database unavailable"));
        when(groupInvitationRepository.findByInvitedUserEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(any(), any()))
                .thenThrow(new RuntimeException("database unavailable"));
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<?> callback = invocation.getArgument(0);
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

        groupService.createGroup(
                "creator@example.com",
                new CreateGroupRequest("DBI202 Study Group", "Database prep", "DBI202", List.of("friend@example.com"))
        );

        Long invitationId = socialService.getState("friend@example.com").groupInvitations().get(0).id();
        socialService.acceptGroupInvitation(invitationId, "friend@example.com");

        List<GroupSummaryResponse> groups = groupService.listMyGroups("friend@example.com");

        assertThat(groups).extracting(GroupSummaryResponse::name).containsExactly("DBI202 Study Group");
    }
}
