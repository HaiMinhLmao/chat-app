package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.UpdateProfileRequest;
import com.myclass.chat_app.dto.UserResponse;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.UserRepository;
import com.myclass.chat_app.support.UserIdentitySupport;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TransientCollaborationStore transientStore;

    public UserService(UserRepository userRepository, TransientCollaborationStore transientStore) {
        this.userRepository = userRepository;
        this.transientStore = transientStore;
    }

    public User upsertByEmail(String email, String fullName) {
        String normalizedEmail = UserIdentitySupport.normalizeEmail(email);
        if (normalizedEmail == null) {
            throw new IllegalArgumentException("Email is required");
        }
        String trimmedFullName = UserIdentitySupport.trimToNull(fullName);

        try {
            User user = userRepository.findByEmailIgnoreCase(normalizedEmail).orElseGet(User::new);
            user.setEmail(normalizedEmail);
            if (trimmedFullName != null) {
                user.setFullName(trimmedFullName);
            }
            User saved = userRepository.save(user);
            transientStore.upsertUser(
                    normalizedEmail,
                    saved.getFullName(),
                    saved.getAvatarUrl(),
                    saved.getBirthDate(),
                    saved.getPreferredLanguage()
            );
            return saved;
        } catch (RuntimeException ignored) {
            return transientStore.upsertUser(normalizedEmail, fullName);
        }
    }

    public List<UserResponse> listUsers(String excludeEmail) {
        String normalizedExclude = UserIdentitySupport.normalizeEmail(excludeEmail);
        try {
            List<User> users = userRepository.findAll();
            users.forEach(user -> transientStore.upsertUser(
                    user.getEmail(),
                    user.getFullName(),
                    user.getAvatarUrl(),
                    user.getBirthDate(),
                    user.getPreferredLanguage()
            ));
            return users.stream()
                    .filter(user -> normalizedExclude == null || !user.getEmail().equalsIgnoreCase(normalizedExclude))
                    .map(this::toResponse)
                    .toList();
        } catch (RuntimeException ignored) {
            return transientStore.listUsers().stream()
                    .filter(user -> normalizedExclude == null || !user.getEmail().equalsIgnoreCase(normalizedExclude))
                    .map(this::toResponse)
                    .toList();
        }
    }

    public UserResponse getProfile(String email) {
        return toResponse(upsertByEmail(email, null));
    }

    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        String normalizedEmail = UserIdentitySupport.normalizeEmail(email);
        if (normalizedEmail == null) {
            throw new IllegalArgumentException("Unauthorized");
        }
        if (request == null) {
            throw new IllegalArgumentException("Profile data is required");
        }

        String trimmedFullName = UserIdentitySupport.trimToNull(request.fullName());
        if (trimmedFullName == null) {
            throw new IllegalArgumentException("Display name is required");
        }
        LocalDate birthDate = request.birthDate();
        if (birthDate != null && birthDate.isAfter(LocalDate.now())) {
            throw new IllegalArgumentException("Birth date cannot be in the future");
        }

        String avatarUrl = UserIdentitySupport.trimToNull(request.avatarUrl());
        String preferredLanguage = normalizePreferredLanguage(request.preferredLanguage());

        try {
            User user = userRepository.findByEmailIgnoreCase(normalizedEmail).orElseGet(User::new);
            user.setEmail(normalizedEmail);
            user.setFullName(trimmedFullName);
            user.setAvatarUrl(avatarUrl);
            user.setBirthDate(birthDate);
            user.setPreferredLanguage(preferredLanguage);
            User saved = userRepository.save(user);
            transientStore.updateUserProfile(
                    normalizedEmail,
                    saved.getFullName(),
                    saved.getAvatarUrl(),
                    saved.getBirthDate(),
                    saved.getPreferredLanguage()
            );
            return toResponse(saved);
        } catch (RuntimeException ignored) {
            return toResponse(transientStore.updateUserProfile(
                    normalizedEmail,
                    trimmedFullName,
                    avatarUrl,
                    birthDate,
                    preferredLanguage
            ));
        }
    }

    private String normalizePreferredLanguage(String preferredLanguage) {
        String normalized = UserIdentitySupport.trimToNull(preferredLanguage);
        if (normalized == null) {
            return "vi";
        }
        String lower = normalized.toLowerCase(Locale.ROOT);
        if (!lower.equals("vi") && !lower.equals("en")) {
            throw new IllegalArgumentException("Language must be vi or en");
        }
        return lower;
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                UserIdentitySupport.displayName(user),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getBirthDate(),
                user.getPreferredLanguage()
        );
    }
}

