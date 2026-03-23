package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.UserResponse;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.UserRepository;
import com.myclass.chat_app.support.UserIdentitySupport;
import org.springframework.stereotype.Service;

import java.util.List;

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
            transientStore.upsertUser(normalizedEmail, saved.getFullName());
            return saved;
        } catch (RuntimeException ignored) {
            return transientStore.upsertUser(normalizedEmail, fullName);
        }
    }

    public List<UserResponse> listUsers(String excludeEmail) {
        String normalizedExclude = UserIdentitySupport.normalizeEmail(excludeEmail);
        try {
            List<User> users = userRepository.findAll();
            users.forEach(user -> transientStore.upsertUser(user.getEmail(), user.getFullName()));
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

    public UserResponse updateProfile(String email, String fullName) {
        String trimmedFullName = UserIdentitySupport.trimToNull(fullName);
        if (trimmedFullName == null) {
            throw new IllegalArgumentException("Display name is required");
        }
        return toResponse(upsertByEmail(email, trimmedFullName));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
                user.getId(),
                UserIdentitySupport.displayName(user),
                user.getEmail(),
                user.getFullName()
        );
    }
}

