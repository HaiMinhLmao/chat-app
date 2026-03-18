package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.GroupChatMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.time.Instant;
import java.util.Locale;

@Controller
public class GroupChatController {

    @MessageMapping("/groups/{groupId}/send")
    @SendTo("/topic/groups/{groupId}")
    public GroupChatMessage sendToGroup(@DestinationVariable Long groupId, @Payload GroupChatMessage message) {
        if (groupId == null || message == null) {
            return null;
        }

        String sender = normalizeEmail(message.senderEmail());
        String senderName = trimToNull(message.senderName());
        String content = trimToNull(message.content());
        if (sender == null || content == null) {
            return null;
        }

        // Group discoverability is already controlled by the lobby list.
        // During fallback mode the membership store can lag behind or reset,
        // so we avoid silently dropping valid group messages here.
        return new GroupChatMessage(
                groupId,
                sender,
                senderName != null ? senderName : defaultDisplayName(sender),
                content,
                Instant.now()
        );
    }

    private static String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        String normalized = email.trim().toLowerCase(Locale.ROOT);
        return normalized.isBlank() ? null : normalized;
    }

    private static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static String defaultDisplayName(String email) {
        int index = email.indexOf('@');
        return index > 0 ? email.substring(0, index) : email;
    }
}

