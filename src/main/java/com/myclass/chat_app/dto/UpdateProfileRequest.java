package com.myclass.chat_app.dto;

import java.time.LocalDate;

public record UpdateProfileRequest(
        String fullName,
        String avatarUrl,
        LocalDate birthDate,
        String preferredLanguage
) {
}
