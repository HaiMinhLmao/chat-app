package com.myclass.chat_app.dto;

import java.time.Instant;

public record DirectChatMessage(
        String conversationKey,
        String senderEmail,
        String senderName,
        String recipientEmail,
        String content,
        Instant timestamp
) {
}
