package com.myclass.chat_app.controller;

import com.myclass.chat_app.entity.Message;
import com.myclass.chat_app.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;

    /**
     * Nhận tin nhắn từ client gửi tới /app/chat.send
     * Broadcast đến tất cả client subscribe /topic/messages
     */
    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public Message sendMessage(@Payload @NonNull Message message) {
        return messageService.saveLobbyMessage(message);
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
