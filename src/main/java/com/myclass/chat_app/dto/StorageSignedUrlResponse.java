package com.myclass.chat_app.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record StorageSignedUrlResponse(
        @JsonProperty("signedURL")
        String signedURL,
        @JsonProperty("signedUrl")
        String signedUrl
) {

    public String resolvedSignedUrl() {
        return signedURL != null && !signedURL.isBlank() ? signedURL : signedUrl;
    }
}
