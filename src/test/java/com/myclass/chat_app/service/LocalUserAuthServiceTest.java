package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.AuthSessionResponse;
import com.myclass.chat_app.entity.LocalCredential;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.LocalCredentialRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class LocalUserAuthServiceTest {

    @Test
    void canRegisterLoginAndRefreshLocalUser() {
        UserService userService = mock(UserService.class);
        LocalCredentialRepository repository = mock(LocalCredentialRepository.class);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        User user = new User();
        user.setId(7L);
        user.setEmail("student@example.com");
        user.setFullName("Student");

        LocalCredential credential = new LocalCredential();
        credential.setId(3L);
        credential.setUser(user);
        credential.setPasswordHash(passwordEncoder.encode("secret123"));

        when(repository.existsByUserEmailIgnoreCase("student@example.com")).thenReturn(false, true);
        when(userService.upsertByEmail("student@example.com", "Student")).thenReturn(user);
        when(repository.save(any(LocalCredential.class))).thenAnswer(invocation -> {
            LocalCredential saved = invocation.getArgument(0, LocalCredential.class);
            saved.setId(3L);
            return saved;
        });
        when(repository.findByUserEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(credential));

        LocalUserAuthService service = new LocalUserAuthService(
                userService,
                repository,
                passwordEncoder,
                "myclassroom-local-demo-secret-please-change-2026"
        );

        AuthSessionResponse registerResponse = service.register("student@example.com", "secret123", "Student");
        AuthSessionResponse loginResponse = service.login("student@example.com", "secret123");
        AuthSessionResponse refreshResponse = service.refresh(loginResponse.refreshToken());

        assertThat(registerResponse.accessToken()).isNotBlank();
        assertThat(registerResponse.refreshToken()).isNotBlank();
        assertThat(registerResponse.user()).isNotNull();
        assertThat(loginResponse.accessToken()).isNotBlank();
        assertThat(loginResponse.refreshToken()).isNotBlank();
        assertThat(refreshResponse.accessToken()).isNotBlank();
        assertThat(refreshResponse.refreshToken()).isNotBlank();
        assertThat(loginResponse.user().email()).isEqualTo("student@example.com");
    }

    @Test
    void rejectsWrongPasswordForLocalUser() {
        UserService userService = mock(UserService.class);
        LocalCredentialRepository repository = mock(LocalCredentialRepository.class);
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        User user = new User();
        user.setEmail("student@example.com");

        LocalCredential credential = new LocalCredential();
        credential.setUser(user);
        credential.setPasswordHash(passwordEncoder.encode("secret123"));

        when(repository.findByUserEmailIgnoreCase("student@example.com")).thenReturn(Optional.of(credential));

        LocalUserAuthService service = new LocalUserAuthService(
                userService,
                repository,
                passwordEncoder,
                "myclassroom-local-demo-secret-please-change-2026"
        );

        assertThatThrownBy(() -> service.login("student@example.com", "wrong-password"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid local credentials");
    }
}
