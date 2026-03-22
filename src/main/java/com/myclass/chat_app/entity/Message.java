package com.myclass.chat_app.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Entity
@Table(
        name = "messages",
        indexes = {
                @Index(name = "idx_messages_type_room_time", columnList = "type,room,timestamp"),
                @Index(name = "idx_messages_type_group_time", columnList = "type,group_id,timestamp"),
                @Index(name = "idx_messages_sender_recipient_time", columnList = "sender_email,recipient_email,timestamp")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String sender;

    @Column(length = 320)
    private String senderEmail;

    @Column(length = 320)
    private String recipientEmail;

    private Long groupId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(length = 255)
    private String attachmentName;

    @Column(length = 120)
    private String attachmentContentType;

    @Column(columnDefinition = "TEXT")
    private String attachmentBase64;

    @Column(length = 1024)
    private String attachmentStoragePath;

    private Long attachmentSize;

    @Column(nullable = false, updatable = false)
    private Instant timestamp;

    @Column(length = 512)
    private String room;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MessageType type = MessageType.LOBBY;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = Instant.now();
        }
    }
}
