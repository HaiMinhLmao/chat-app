package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.AuthRequest;
import com.myclass.chat_app.dto.AuthSessionResponse;
import com.myclass.chat_app.dto.AuthUserMetadataResponse;
import com.myclass.chat_app.dto.AuthUserResponse;
import com.myclass.chat_app.service.SupabaseAuthService;
import com.myclass.chat_app.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AuthControllerTest {

    @Test
    void loginUsesSupabaseAuth() {
        SupabaseAuthService supabaseAuthService = mock(SupabaseAuthService.class);
        UserService userService = mock(UserService.class);
        AuthSessionResponse supabaseResponse = session("student@example.com", "Student", null);
        when(supabaseAuthService.login("student@example.com", "secret123")).thenReturn(supabaseResponse);

        AuthController controller = new AuthController(
                supabaseAuthService,
                userService
        );

        ResponseEntity<?> response = controller.login(new AuthRequest("student@example.com", "secret123", null));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(supabaseResponse);
    }

    @Test
    void registerUsesSupabaseAuth() {
        SupabaseAuthService supabaseAuthService = mock(SupabaseAuthService.class);
        UserService userService = mock(UserService.class);
        AuthSessionResponse supabaseResponse = session("student@example.com", "Student", null);
        when(supabaseAuthService.register("student@example.com", "secret123", "Student"))
                .thenReturn(supabaseResponse);

        AuthController controller = new AuthController(
                supabaseAuthService,
                userService
        );

        ResponseEntity<?> response = controller.register(new AuthRequest("student@example.com", "secret123", "Student"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(supabaseResponse);
    }

    @Test
    void registerReturnsServiceUnavailableWhenSupabaseIsUnavailable() {
        SupabaseAuthService supabaseAuthService = mock(SupabaseAuthService.class);
        UserService userService = mock(UserService.class);
        when(supabaseAuthService.register("student@example.com", "secret123", "Student"))
                .thenThrow(new RuntimeException("Supabase signup timed out after 8 seconds."));

        AuthController controller = new AuthController(
                supabaseAuthService,
                userService
        );

        ResponseEntity<?> response = controller.register(new AuthRequest("student@example.com", "secret123", "Student"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
    }

    @Test
    void loginReturnsUnauthorizedWhenSupabaseRejectsCredentials() {
        SupabaseAuthService supabaseAuthService = mock(SupabaseAuthService.class);
        UserService userService = mock(UserService.class);
        when(supabaseAuthService.login("student@example.com", "wrong-password"))
                .thenThrow(new RuntimeException("HTTP 400 from Supabase: {\"error_code\":\"invalid_credentials\"}"));

        AuthController controller = new AuthController(
                supabaseAuthService,
                userService
        );

        ResponseEntity<?> response = controller.login(new AuthRequest("student@example.com", "wrong-password", null));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    private AuthSessionResponse session(String email, String fullName, String mode) {
        return new AuthSessionResponse(
                "access-token",
                "refresh-token",
                new AuthUserResponse(email, new AuthUserMetadataResponse(fullName, fullName, true, "USER")),
                mode,
                null
        );
    }
}
