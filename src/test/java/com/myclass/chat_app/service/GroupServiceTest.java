package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.CreateGroupRequest;
import com.myclass.chat_app.dto.GroupResponse;
import com.myclass.chat_app.dto.GroupSummaryResponse;
import com.myclass.chat_app.entity.ChatGroup;
import com.myclass.chat_app.entity.GroupInvitation;
import com.myclass.chat_app.entity.GroupMember;
import com.myclass.chat_app.entity.GroupRole;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.ChatGroupRepository;
import com.myclass.chat_app.repository.GroupInvitationRepository;
import com.myclass.chat_app.repository.GroupMemberRepository;
import com.myclass.chat_app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.transaction.support.TransactionCallback;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GroupServiceTest {

    @Test
    void createGroupFallsBackToTransientStoreWhenDatabaseWriteFails() {
        ChatGroupRepository groupRepository = mock(ChatGroupRepository.class);
        GroupMemberRepository memberRepository = mock(GroupMemberRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
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
        when(groupRepository.save(any())).thenThrow(new RuntimeException("database unavailable"));
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<Object> callback = transactionCallback(invocation);
            return callback.doInTransaction(null);
        });

        GroupService service = new GroupService(
                groupRepository,
                memberRepository,
                groupInvitationRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );
        transientStore.upsertUser("friend@example.com", "Friend");

        GroupResponse response = service.createGroup(
                "creator@example.com",
                new CreateGroupRequest(
                        "Fallback Group",
                        "still works",
                        "DBI202",
                        List.of("friend@example.com")
                )
        );

        assertThat(response.id()).isNotNull();
        assertThat(response.id()).isGreaterThanOrEqualTo(10_000L);
        assertThat(response.name()).isEqualTo("Fallback Group");
        assertThat(response.createdByEmail()).isEqualTo("creator@example.com");
        assertThat(response.members())
                .extracting(GroupResponse.GroupMemberResponse::email)
                .containsExactly("creator@example.com");
    }

    @Test
    void listMyGroupsMergesTransientGroupsWithDatabaseGroups() {
        ChatGroupRepository groupRepository = mock(ChatGroupRepository.class);
        GroupMemberRepository memberRepository = mock(GroupMemberRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        TransactionTemplate transactionTemplate = mock(TransactionTemplate.class);
        TransientCollaborationStore transientStore = new TransientCollaborationStore();

        User creator = new User();
        creator.setId(1L);
        creator.setEmail("creator@example.com");
        creator.setFullName("Creator");

        when(userRepository.findByEmailIgnoreCase("creator@example.com")).thenReturn(Optional.of(creator));
        when(groupRepository.save(any())).thenThrow(new RuntimeException("database unavailable"));
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<Object> callback = transactionCallback(invocation);
            return callback.doInTransaction(null);
        });

        ChatGroup databaseGroup = new ChatGroup();
        databaseGroup.setId(5L);
        databaseGroup.setName("Database Group");
        databaseGroup.setCategory("MAD101");

        GroupMember membership = new GroupMember();
        membership.setGroup(databaseGroup);
        membership.setUser(creator);
        membership.setRole(GroupRole.ADMIN);

        when(memberRepository.findByUserEmailIgnoreCase("creator@example.com")).thenReturn(List.of(membership));

        GroupService service = new GroupService(
                groupRepository,
                memberRepository,
                groupInvitationRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );

        service.createGroup(
                "creator@example.com",
                new CreateGroupRequest("Fallback Group", "still works", "DBI202", List.of())
        );

        List<GroupSummaryResponse> groups = service.listMyGroups("creator@example.com");

        assertThat(groups)
                .extracting(GroupSummaryResponse::name)
                .containsExactly("Fallback Group", "Database Group");
    }

    @Test
    void createGroupRejectsUnknownInvitedEmailsWhenDatabaseIsAvailable() {
        ChatGroupRepository groupRepository = mock(ChatGroupRepository.class);
        GroupMemberRepository memberRepository = mock(GroupMemberRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
        TransactionTemplate transactionTemplate = mock(TransactionTemplate.class);
        TransientCollaborationStore transientStore = new TransientCollaborationStore();

        User creator = new User();
        creator.setId(1L);
        creator.setEmail("creator@example.com");
        creator.setFullName("Creator");

        when(userRepository.findByEmailIgnoreCase("creator@example.com")).thenReturn(Optional.of(creator));
        when(userRepository.findByEmailIgnoreCase("friend@example.com")).thenReturn(Optional.empty());
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<Object> callback = transactionCallback(invocation);
            return callback.doInTransaction(null);
        });

        GroupService service = new GroupService(
                groupRepository,
                memberRepository,
                groupInvitationRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );

        assertThatThrownBy(() -> service.createGroup(
                "creator@example.com",
                new CreateGroupRequest(
                        "Database Group",
                        "db path",
                        "MAD101",
                        List.of("friend@example.com")
                )
        ))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("No MyClassRoom account found for friend@example.com.");
    }

    @Test
    void createGroupSavesInvitationForExistingMembersWhenDatabaseIsAvailable() {
        ChatGroupRepository groupRepository = mock(ChatGroupRepository.class);
        GroupMemberRepository memberRepository = mock(GroupMemberRepository.class);
        GroupInvitationRepository groupInvitationRepository = mock(GroupInvitationRepository.class);
        UserRepository userRepository = mock(UserRepository.class);
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
        when(groupRepository.save(any(ChatGroup.class))).thenAnswer(invocation -> {
            ChatGroup group = invocation.getArgument(0, ChatGroup.class);
            group.setId(7L);
            return group;
        });
        when(memberRepository.save(any(GroupMember.class))).thenAnswer(invocation -> invocation.getArgument(0, GroupMember.class));
        when(groupInvitationRepository.save(any(GroupInvitation.class))).thenAnswer(invocation -> invocation.getArgument(0, GroupInvitation.class));
        when(transactionTemplate.execute(any())).thenAnswer(invocation -> {
            TransactionCallback<Object> callback = transactionCallback(invocation);
            return callback.doInTransaction(null);
        });

        GroupService service = new GroupService(
                groupRepository,
                memberRepository,
                groupInvitationRepository,
                userRepository,
                transientStore,
                transactionTemplate
        );

        service.createGroup(
                "creator@example.com",
                new CreateGroupRequest(
                        "Database Group",
                        "db path",
                        "MAD101",
                        List.of("friend@example.com")
                )
        );

        ArgumentCaptor<GroupInvitation> invitationCaptor = ArgumentCaptor.forClass(GroupInvitation.class);
        verify(groupInvitationRepository).save(invitationCaptor.capture());
        assertThat(invitationCaptor.getValue().getInvitedUser().getEmail()).isEqualTo("friend@example.com");
    }

    @SuppressWarnings("unchecked")
    private static TransactionCallback<Object> transactionCallback(org.mockito.invocation.InvocationOnMock invocation) {
        return (TransactionCallback<Object>) invocation.getArgument(0, TransactionCallback.class);
    }
}
