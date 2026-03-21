package com.myclass.chat_app.dto;

public record UserResponse(
        Long id,
        String username,
        String email,
        String fullName
) {
}
