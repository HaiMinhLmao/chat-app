package com.myclass.chat_app.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthUserResponse(
        String email,
        @JsonProperty("user_metadata")
        AuthUserMetadataResponse userMetadata
) {

    public String resolvedEmail(String fallbackEmail) {
        if (email != null && !email.isBlank()) {
            return email.trim();
        }
        return fallbackEmail;
    }

    public String resolvedFullName(String fallbackFullName) {
        if (userMetadata == null) {
            return fallbackFullName;
        }
        return userMetadata.resolvedFullName(fallbackFullName);
    }
}
