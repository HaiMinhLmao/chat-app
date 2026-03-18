package com.myclass.chat_app.controller;

import com.myclass.chat_app.entity.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;

// NOTE: This project previously persisted messages via JPA.
// JPA/DataSource auto-config is currently disabled to allow running without DB connectivity.
// If you re-enable DB later, restore the repository-based persistence.
@RequiredArgsConstructor
public class ChatController {

    /**
     * Nhận tin nhắn từ client gửi tới /app/chat.send
     * Broadcast đến tất cả client subscribe /topic/messages
     */
    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public Message sendMessage(@Payload @NonNull Message message) {
        return message;
    }

    /**
     * User tham gia chat room
     */
    @MessageMapping("/chat.join")
    @SendTo("/topic/messages")
    public Message joinChat(@Payload Message message) {
        message.setContent(message.getSender() + " đã tham gia phòng chat!");
        return message;
    }

    /**
     * User rời khỏi chat room
     */
    @MessageMapping("/chat.leave")
    @SendTo("/topic/messages")
    public Message leaveChat(@Payload Message message) {
        message.setContent(message.getSender() + " đã rời khỏi phòng chat!");
        return message;
    }
}
