package com.myclass.chat_app.repository;

import com.myclass.chat_app.entity.GroupInvitation;
import com.myclass.chat_app.entity.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupInvitationRepository extends JpaRepository<GroupInvitation, Long> {

    List<GroupInvitation> findByInvitedUserEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(String email, InvitationStatus status);

    List<GroupInvitation> findByGroupIdAndInvitedUserEmailIgnoreCaseOrderByCreatedAtDesc(Long groupId, String email);
}
