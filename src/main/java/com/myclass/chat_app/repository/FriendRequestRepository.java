package com.myclass.chat_app.repository;

import com.myclass.chat_app.entity.FriendRequest;
import com.myclass.chat_app.entity.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {

    List<FriendRequest> findByRecipientEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(String email, InvitationStatus status);

    List<FriendRequest> findByRequesterEmailIgnoreCaseAndStatusOrderByCreatedAtDesc(String email, InvitationStatus status);

    @Query("""
            select request from FriendRequest request
            where (
                    (lower(request.requester.email) = lower(:firstEmail) and lower(request.recipient.email) = lower(:secondEmail))
                 or (lower(request.requester.email) = lower(:secondEmail) and lower(request.recipient.email) = lower(:firstEmail))
            )
            order by request.createdAt desc
            """)
    List<FriendRequest> findBetweenUsers(
            @Param("firstEmail") String firstEmail,
            @Param("secondEmail") String secondEmail
    );

    @Query("""
            select request from FriendRequest request
            where request.status = :status
              and (
                    lower(request.requester.email) = lower(:email)
                 or lower(request.recipient.email) = lower(:email)
              )
            order by request.createdAt desc
            """)
    List<FriendRequest> findConnections(
            @Param("email") String email,
            @Param("status") InvitationStatus status
    );
}
