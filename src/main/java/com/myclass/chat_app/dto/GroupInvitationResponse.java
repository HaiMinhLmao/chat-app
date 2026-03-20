package com.myclass.chat_app.dto;

import java.time.Instant;

public record GroupInvitationResponse(
        Long id,
        Long groupId,
        String groupName,
        String groupCategory,
        String invitedByEmail,
        String invitedByName,
        String status,
        Instant createdAt
) {
}
