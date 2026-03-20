package com.myclass.chat_app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AuthRefreshRequest(
        @JsonProperty("refresh_token")
        String refreshToken
) {

    public boolean hasRefreshToken() {
        return refreshToken != null && !refreshToken.isBlank();
    }

    public String trimmedRefreshToken() {
        return refreshToken == null ? null : refreshToken.trim();
    }
}
