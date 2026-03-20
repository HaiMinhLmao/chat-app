package com.myclass.chat_app.dto;

import java.time.Instant;

public record FriendRequestResponse(
        Long id,
        String requesterEmail,
        String requesterName,
        String recipientEmail,
        String recipientName,
        String status,
        Instant createdAt
) {
}
