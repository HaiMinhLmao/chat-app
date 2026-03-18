package com.myclass.chat_app.service;

import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.UserRepository;
import org.springframework.stereotype.Service;

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
}

