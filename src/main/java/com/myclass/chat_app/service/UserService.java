package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.UserResponse;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final TransientCollaborationStore transientStore;

    public UserService(UserRepository userRepository, TransientCollaborationStore transientStore) {
        this.userRepository = userRepository;
        this.transientStore = transientStore;
    }

    public Optional<User> findByEmail(String email) {
        if (email == null || email.isBlank()) return Optional.empty();
        String normalizedEmail = email.trim().toLowerCase();
        try {
            Optional<User> user = userRepository.findByEmailIgnoreCase(normalizedEmail);
            if (user.isPresent()) {
                transientStore.upsertUser(normalizedEmail, user.get().getFullName());
                return user;
            }
        } catch (RuntimeException ignored) {
            // Fall back to transient storage when the database is unavailable.
        }
        return transientStore.findUserByEmail(normalizedEmail);
    }

    public User upsertByEmail(String email, String fullName) {
        String normalizedEmail = email == null ? "" : email.trim().toLowerCase();
        if (normalizedEmail.isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }

        try {
            User user = userRepository.findByEmailIgnoreCase(normalizedEmail).orElseGet(User::new);
            user.setEmail(normalizedEmail);
            if (fullName != null && !fullName.isBlank()) {
                user.setFullName(fullName.trim());
            }
            User saved = userRepository.save(user);
            transientStore.upsertUser(normalizedEmail, saved.getFullName());
            return saved;
        } catch (RuntimeException ignored) {
            return transientStore.upsertUser(normalizedEmail, fullName);
        }
    }

    public List<UserResponse> listUsers(String excludeEmail) {
        String normalizedExclude = excludeEmail == null ? "" : excludeEmail.trim().toLowerCase();
        try {
            List<User> users = userRepository.findAll();
            users.forEach(user -> transientStore.upsertUser(user.getEmail(), user.getFullName()));
            return users.stream()
                    .filter(user -> !user.getEmail().equalsIgnoreCase(normalizedExclude))
                    .map(this::toResponse)
                    .toList();
        } catch (RuntimeException ignored) {
            return transientStore.listUsers().stream()
                    .filter(user -> !user.getEmail().equalsIgnoreCase(normalizedExclude))
                    .map(this::toResponse)
                    .toList();
        }
    }

    private UserResponse toResponse(User user) {
        String fullName = user.getFullName();
        String username = (fullName != null && !fullName.isBlank())
                ? fullName
                : defaultDisplayName(user.getEmail());
        return new UserResponse(
                user.getId(),
                username,
                user.getEmail(),
                fullName
        );
    }

    private String defaultDisplayName(String email) {
        if (email == null) {
            return "User";
        }
        int index = email.indexOf('@');
        return index > 0 ? email.substring(0, index) : email;
    }
}

