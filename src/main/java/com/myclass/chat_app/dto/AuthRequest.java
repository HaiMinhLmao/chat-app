package com.myclass.chat_app.dto;

public record AuthRequest(
        String email,
        String password,
        String fullName
) {

    public boolean hasEmailAndPassword() {
        return email != null && !email.isBlank() && password != null && !password.isBlank();
    }

    public String trimmedIdentifier() {
        return email == null ? null : email.trim();
    }

    public String safeFullName() {
        return fullName == null ? "" : fullName.trim();
    }
}
