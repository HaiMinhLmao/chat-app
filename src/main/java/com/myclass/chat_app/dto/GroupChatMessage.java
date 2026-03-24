package com.myclass.chat_app.dto;

import java.time.Instant;

public record GroupChatMessage(
        Long id,
        Long groupId,
        String senderEmail,
        String senderName,
        String content,
        String attachmentName,
        String attachmentContentType,
        String attachmentBase64,
        String attachmentUrl,
        Long attachmentSize,
        Instant timestamp,
        boolean recalled,
        boolean pinned,
        Instant pinnedAt
) {
}

