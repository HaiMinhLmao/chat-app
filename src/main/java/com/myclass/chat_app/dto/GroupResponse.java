package com.myclass.chat_app.dto;

import java.time.Instant;
import java.util.List;

public record GroupResponse(
        Long id,
        String name,
        String description,
        String category,
        String createdByEmail,
        Instant createdAt,
        List<GroupMemberResponse> members
) {
    public record GroupMemberResponse(
            String email,
            String role
    ) {
    }
}

