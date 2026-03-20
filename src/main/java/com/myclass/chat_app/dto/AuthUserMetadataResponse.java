package com.myclass.chat_app.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public record AuthUserMetadataResponse(
        @JsonProperty("full_name")
        String fullName,
        String username,
        @JsonProperty("local_auth")
        Boolean localAuth,
        String role
) {

    public String resolvedFullName(String fallbackFullName) {
        if (fullName != null && !fullName.isBlank()) {
            return fullName.trim();
        }
        return fallbackFullName;
    }
}
