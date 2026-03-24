package com.myclass.chat_app.repository;

import com.myclass.chat_app.entity.Message;
import com.myclass.chat_app.entity.MessageType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findTop100ByTypeAndRoomOrderByTimestampDesc(MessageType type, String room);

    List<Message> findTop100ByTypeAndGroupIdOrderByTimestampDesc(MessageType type, Long groupId);

    @Query("""
            select m from Message m
            where m.type = :type
              and (
                    (lower(m.senderEmail) = lower(:firstEmail) and lower(m.recipientEmail) = lower(:secondEmail))
                 or (lower(m.senderEmail) = lower(:secondEmail) and lower(m.recipientEmail) = lower(:firstEmail))
              )
            order by m.timestamp desc
            """)
    List<Message> findDirectConversation(
            @Param("type") MessageType type,
            @Param("firstEmail") String firstEmail,
            @Param("secondEmail") String secondEmail,
            Pageable pageable
    );

    List<Message> findByTypeAndGroupIdAndPinnedTrueOrderByPinnedAtDescTimestampDesc(
            MessageType type,
            Long groupId,
            Pageable pageable
    );

    @Query("""
            select m from Message m
            where m.type = :type
              and m.pinned = true
              and (
                    (lower(m.senderEmail) = lower(:firstEmail) and lower(m.recipientEmail) = lower(:secondEmail))
                 or (lower(m.senderEmail) = lower(:secondEmail) and lower(m.recipientEmail) = lower(:firstEmail))
              )
            order by m.pinnedAt desc, m.timestamp desc
            """)
    List<Message> findPinnedDirectConversation(
            @Param("type") MessageType type,
            @Param("firstEmail") String firstEmail,
            @Param("secondEmail") String secondEmail,
            Pageable pageable
    );
}
