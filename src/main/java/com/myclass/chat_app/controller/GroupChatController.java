package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.GroupChatMessage;
import com.myclass.chat_app.service.GroupService;
import com.myclass.chat_app.service.MessageService;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class GroupChatController {

    private final MessageService messageService;
    private final GroupService groupService;

    public GroupChatController(MessageService messageService, GroupService groupService) {
        this.messageService = messageService;
        this.groupService = groupService;
    }

    @MessageMapping("/groups/{groupId}/send")
    @SendTo("/topic/groups/{groupId}")
    public GroupChatMessage sendToGroup(@DestinationVariable Long groupId, @Payload GroupChatMessage message) {
        if (message == null || !groupService.isMember(groupId, message.senderEmail())) {
            return null;
        }
        return messageService.saveGroupMessage(groupId, message);
    }
}

