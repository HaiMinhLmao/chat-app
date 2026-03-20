package com.myclass.chat_app.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthSessionResponse(
        @JsonProperty("access_token")
        String accessToken,
        @JsonProperty("refresh_token")
        String refreshToken,
        AuthUserResponse user,
        String mode,
        String message
) {

    public AuthTokenPairResponse toTokenPair() {
        return new AuthTokenPairResponse(accessToken, refreshToken);
    }

    public String resolvedEmail(String fallbackEmail) {
        if (user == null) {
            return fallbackEmail;
        }
        return user.resolvedEmail(fallbackEmail);
    }

    public String resolvedFullName(String fallbackFullName) {
        if (user == null) {
            return fallbackFullName;
        }
        return user.resolvedFullName(fallbackFullName);
    }
}
