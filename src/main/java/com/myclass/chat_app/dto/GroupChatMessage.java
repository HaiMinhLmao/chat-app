package com.myclass.chat_app.dto;

import java.time.Instant;

public record GroupChatMessage(
        Long groupId,
        String senderEmail,
        String senderName,
        String content,
        Instant timestamp
) {
}

