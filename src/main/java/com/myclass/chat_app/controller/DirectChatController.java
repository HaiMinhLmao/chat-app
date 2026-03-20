package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.DirectChatMessage;
import com.myclass.chat_app.service.MessageService;
import com.myclass.chat_app.service.SocialService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class DirectChatController {

    private final MessageService messageService;
    private final SocialService socialService;

    public DirectChatController(MessageService messageService, SocialService socialService) {
        this.messageService = messageService;
        this.socialService = socialService;
    }

    @MessageMapping("/direct/{conversationKey}/send")
    @SendTo("/topic/direct/{conversationKey}")
    public DirectChatMessage sendDirect(
            @DestinationVariable String conversationKey,
            @Payload DirectChatMessage message
    ) {
        if (message == null || !socialService.areFriends(message.senderEmail(), message.recipientEmail())) {
            return null;
        }
        return messageService.saveDirectMessage(conversationKey, message);
    }
}
