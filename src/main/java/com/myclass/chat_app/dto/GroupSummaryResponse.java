package com.myclass.chat_app.dto;

public record GroupSummaryResponse(
        Long id,
        String name,
        String category,
        String role
) {
}

