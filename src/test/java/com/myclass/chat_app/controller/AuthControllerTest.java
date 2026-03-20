package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.AuthRequest;
import com.myclass.chat_app.dto.AuthSessionResponse;
import com.myclass.chat_app.dto.AuthUserMetadataResponse;
import com.myclass.chat_app.dto.AuthUserResponse;
import com.myclass.chat_app.service.LocalAdminAuthService;
import com.myclass.chat_app.service.LocalUserAuthService;
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
    void loginFallsBackToLocalUserWhenSupabaseRejectsCredentials() {
        SupabaseAuthService supabaseAuthService = mock(SupabaseAuthService.class);
        LocalAdminAuthService localAdminAuthService = mock(LocalAdminAuthService.class);
        LocalUserAuthService localUserAuthService = mock(LocalUserAuthService.class);
        UserService userService = mock(UserService.class);

        AuthSessionResponse localResponse = session("student@example.com", "Student", "local");

        when(localAdminAuthService.supportsIdentifier("student@example.com")).thenReturn(false);
        when(supabaseAuthService.login("student@example.com", "secret123"))
                .thenThrow(new RuntimeException("Supabase login error: HTTP 400 from Supabase: {\"error_code\":\"invalid_credentials\"}"));
        when(localUserAuthService.login("student@example.com", "secret123")).thenReturn(localResponse);

        AuthController controller = new AuthController(
                supabaseAuthService,
                localAdminAuthService,
                localUserAuthService,
                userService
        );

        ResponseEntity<?> response = controller.login(new AuthRequest("student@example.com", "secret123", null));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(localResponse);
    }

    @Test
    void registerFallsBackToLocalUserWhenSupabaseApiKeyIsInvalid() {
        SupabaseAuthService supabaseAuthService = mock(SupabaseAuthService.class);
        LocalAdminAuthService localAdminAuthService = mock(LocalAdminAuthService.class);
        LocalUserAuthService localUserAuthService = mock(LocalUserAuthService.class);
        UserService userService = mock(UserService.class);

        AuthSessionResponse localResponse = session("student@example.com", "Student", "local");

        when(supabaseAuthService.register("student@example.com", "secret123", "Student"))
                .thenThrow(new RuntimeException("Supabase signup error: HTTP 401 from Supabase: {\"message\":\"Invalid API key\"}"));
        when(localUserAuthService.register("student@example.com", "secret123", "Student")).thenReturn(localResponse);

        AuthController controller = new AuthController(
                supabaseAuthService,
                localAdminAuthService,
                localUserAuthService,
                userService
        );

        ResponseEntity<?> response = controller.register(new AuthRequest("student@example.com", "secret123", "Student"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(localResponse);
    }

    @Test
    void registerReturnsServiceUnavailableWhenLocalFallbackCannotReachDatabase() {
        SupabaseAuthService supabaseAuthService = mock(SupabaseAuthService.class);
        LocalAdminAuthService localAdminAuthService = mock(LocalAdminAuthService.class);
        LocalUserAuthService localUserAuthService = mock(LocalUserAuthService.class);
        UserService userService = mock(UserService.class);

        when(supabaseAuthService.register("student@example.com", "secret123", "Student"))
                .thenThrow(new RuntimeException("Supabase signup error: HTTP 401 from Supabase: {\"message\":\"Invalid API key\"}"));
        when(localUserAuthService.register("student@example.com", "secret123", "Student"))
                .thenThrow(new RuntimeException("Unable to acquire JDBC Connection"));

        AuthController controller = new AuthController(
                supabaseAuthService,
                localAdminAuthService,
                localUserAuthService,
                userService
        );

        ResponseEntity<?> response = controller.register(new AuthRequest("student@example.com", "secret123", "Student"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
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
