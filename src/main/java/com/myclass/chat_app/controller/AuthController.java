package com.myclass.chat_app.controller;

import com.myclass.chat_app.service.LocalAdminAuthService;
import com.myclass.chat_app.service.LocalUserAuthService;
import com.myclass.chat_app.service.SupabaseAuthService;
import com.myclass.chat_app.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final SupabaseAuthService supabaseAuthService;
    private final LocalAdminAuthService localAdminAuthService;
    private final LocalUserAuthService localUserAuthService;
    private final UserService userService;

    public AuthController(
            SupabaseAuthService supabaseAuthService,
            LocalAdminAuthService localAdminAuthService,
            LocalUserAuthService localUserAuthService,
            UserService userService
    ) {
        this.supabaseAuthService = supabaseAuthService;
        this.localAdminAuthService = localAdminAuthService;
        this.localUserAuthService = localUserAuthService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            if (request == null) {
                return badRequest("Request body is required");
            }

            String email = request.get("email");
            String password = request.get("password");
            String fullName = request.getOrDefault("fullName", "");
            String normalizedEmail = email == null ? null : email.trim();

            if (isBlank(email) || isBlank(password)) {
                return badRequest("Email and password are required");
            }

            Map<String, Object> supabaseResponse = supabaseAuthService.register(normalizedEmail, password, fullName);
            safeUpsertLocalUser(supabaseResponse, normalizedEmail, fullName);
            return ResponseEntity.status(HttpStatus.CREATED).body(supabaseResponse);

        } catch (Exception e) {
            String message = e.getMessage() == null ? "" : e.getMessage();
            if (message.contains("email_address_invalid")
                    || message.contains("validation_failed")
                    || message.contains("invalid format")) {
                return badRequest("Email is invalid. Please enter a real email address like name@gmail.com, not just a username.");
            }
            if (message.contains("over_email_send_rate_limit")) {
                Map<String, String> safeRequest = request == null ? Map.of() : request;
                Map<String, Object> fallbackResponse = localUserAuthService.register(
                        safeRequest.get("email"),
                        safeRequest.get("password"),
                        safeRequest.getOrDefault("fullName", "")
                );
                safeUpsertLocalUser(fallbackResponse, safeRequest.get("email"), safeRequest.get("fullName"));
                return ResponseEntity.status(HttpStatus.CREATED).body(fallbackResponse);
            }
            if (message.contains("user_already_exists")) {
                return badRequest("This email is already registered in the current Supabase project. Please sign in instead.");
            }
            return badRequest(message);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            if (request == null) {
                return badRequest("Request body is required");
            }

            String email = request.get("email");
            String password = request.get("password");

            if (isBlank(email) || isBlank(password)) {
                return badRequest("Email and password are required");
            }

            if (localAdminAuthService.supportsIdentifier(email)) {
                Map<String, Object> localResponse = localAdminAuthService.login(email.trim(), password);
                safeUpsertLocalUser(localResponse, "user@local.myclass", "Admin");
                return ResponseEntity.ok(localResponse);
            }

            try {
                Map<String, Object> supabaseResponse = supabaseAuthService.login(email.trim(), password);
                Map<String, Object> response = new LinkedHashMap<>();
                response.put("access_token", supabaseResponse.get("access_token"));
                response.put("refresh_token", supabaseResponse.get("refresh_token"));
                response.put("user", supabaseResponse.get("user"));
                safeUpsertLocalUser(supabaseResponse, email, null);
                return ResponseEntity.ok(response);
            } catch (Exception supabaseLoginError) {
                try {
                    if (localUserAuthService.supportsIdentifier(email)) {
                        Map<String, Object> localResponse = localUserAuthService.login(email.trim(), password);
                        safeUpsertLocalUser(localResponse, email, null);
                        return ResponseEntity.ok(localResponse);
                    }
                } catch (RuntimeException localDbError) {
                    log.warn("Skipping local user auth fallback because the database is unavailable: {}", localDbError.getMessage());
                }
                throw supabaseLoginError;
            }

        } catch (Exception e) {
            String message = e.getMessage() == null ? "" : e.getMessage();
            if (message.contains("Unable to acquire JDBC Connection")
                    || message.contains("Connection is not available")
                    || message.contains("request timed out after")) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                        "error",
                        "The app cannot reach the database right now. On deployment, point Spring Boot at the Supabase session pooler on port 5432 and redeploy."
                ));
            }
            if (message.contains("invalid_credentials")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "error",
                        "Invalid login credentials. If Supabase email signup was rate-limited, register again and the app will create a local database account for this email."
                ));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials: " + message));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        try {
            if (request == null) {
                return badRequest("Request body is required");
            }

            String refreshToken = request.get("refresh_token");
            if (isBlank(refreshToken)) {
                return badRequest("Missing refresh_token");
            }

            if (localAdminAuthService.isLocalToken(refreshToken)) {
                return ResponseEntity.ok(localAdminAuthService.refresh(refreshToken));
            }
            if (localUserAuthService.isLocalToken(refreshToken)) {
                return ResponseEntity.ok(localUserAuthService.refresh(refreshToken));
            }

            Map<String, Object> supabaseResponse = supabaseAuthService.refresh(refreshToken);
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("access_token", supabaseResponse.get("access_token"));
            response.put("refresh_token", supabaseResponse.get("refresh_token"));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh failed: " + e.getMessage()));
        }
    }

    private ResponseEntity<?> badRequest(String msg) {
        return ResponseEntity.badRequest().body(Map.of("error", msg));
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    @SuppressWarnings("unchecked")
    private void upsertLocalUser(Map<String, Object> authResponse, String fallbackEmail, String fallbackFullName) {
        if (authResponse == null) {
            userService.upsertByEmail(fallbackEmail, fallbackFullName);
            return;
        }

        Object userObj = authResponse.get("user");
        if (!(userObj instanceof Map<?, ?> userMap)) {
            userService.upsertByEmail(fallbackEmail, fallbackFullName);
            return;
        }

        String email = (String) ((Map<String, Object>) userMap).getOrDefault("email", fallbackEmail);
        String fullName = fallbackFullName;

        Object metaObj = ((Map<String, Object>) userMap).get("user_metadata");
        if (metaObj instanceof Map<?, ?> metaMap) {
            Object fn = ((Map<String, Object>) metaMap).get("full_name");
            if (fn instanceof String s && !s.isBlank()) {
                fullName = s;
            }
        }

        userService.upsertByEmail(email, fullName);
    }

    private void safeUpsertLocalUser(Map<String, Object> authResponse, String fallbackEmail, String fallbackFullName) {
        try {
            upsertLocalUser(authResponse, fallbackEmail, fallbackFullName);
        } catch (RuntimeException e) {
            log.warn("Skipping local user sync because the database is unavailable: {}", e.getMessage());
        }
    }
}
