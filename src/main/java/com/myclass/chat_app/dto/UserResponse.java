package com.myclass.chat_app.dto;

import java.time.LocalDate;

public record UserResponse(
        Long id,
        String username,
        String email,
        String fullName,
        String avatarUrl,
        LocalDate birthDate,
        String preferredLanguage
) {
}
