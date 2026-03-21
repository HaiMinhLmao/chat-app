package com.myclass.chat_app.support;

import com.myclass.chat_app.entity.User;

import java.util.Locale;

public final class UserIdentitySupport {

    private UserIdentitySupport() {
    }

    public static String normalizeEmail(String email) {
        String trimmed = trimToNull(email);
        return trimmed == null ? null : trimmed.toLowerCase(Locale.ROOT);
    }

    public static String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    public static String defaultDisplayName(String email) {
        String candidate = trimToNull(email);
        if (candidate == null) {
            return "User";
        }
        int atIndex = candidate.indexOf('@');
        return atIndex > 0 ? candidate.substring(0, atIndex) : candidate;
    }

    public static String displayName(String email, String fullName) {
        String trimmedFullName = trimToNull(fullName);
        return trimmedFullName != null ? trimmedFullName : defaultDisplayName(email);
    }

    public static String displayName(User user) {
        if (user == null) {
            return "User";
        }
        return displayName(user.getEmail(), user.getFullName());
    }
}
