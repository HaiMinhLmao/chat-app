package com.myclass.chat_app.controller;

import com.myclass.chat_app.service.UserService;
import com.myclass.chat_app.service.SupabaseAuthService;
import com.myclass.chat_app.service.LocalAdminAuthService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final SupabaseAuthService supabaseAuthService;
    private final LocalAdminAuthService localAdminAuthService;
    private final UserService userService;

    public AuthController(
            SupabaseAuthService supabaseAuthService,
            LocalAdminAuthService localAdminAuthService,
            UserService userService
    ) {
        this.supabaseAuthService = supabaseAuthService;
        this.localAdminAuthService = localAdminAuthService;
        this.userService = userService;
    }

    // ================= REGISTER =================
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            if (request == null) {
                return badRequest("Request body is required");
            }
            String email = request.get("email");
            String password = request.get("password");
            String fullName = request.getOrDefault("fullName", "");

            if (isBlank(email) || isBlank(password)) {
                return badRequest("Email and password are required");
            }

            Map<String, Object> sb = supabaseAuthService.register(email.trim(), password, fullName);

            safeUpsertLocalUser(sb, email, fullName);

            return ResponseEntity.status(HttpStatus.CREATED).body(sb);

        } catch (Exception e) {
            return badRequest(e.getMessage());
        }
    }

    // ================= LOGIN =================
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

            Map<String, Object> sb = supabaseAuthService.login(email.trim(), password);

            // 🔥 chuẩn hoá response
            Map<String, Object> response = new LinkedHashMap<>();
            response.put("access_token", sb.get("access_token"));
            response.put("refresh_token", sb.get("refresh_token"));
            response.put("user", sb.get("user"));

            safeUpsertLocalUser(sb, email, null);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            String message = e.getMessage() == null ? "" : e.getMessage();
            if (message.contains("invalid_credentials")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "error",
                        "Invalid login credentials. This is a new Supabase project, so please register this email again here first, or use the local admin account user / admin123."
                ));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials: " + message));
        }
    }

    // ================= REFRESH TOKEN =================
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

            Map<String, Object> sb = supabaseAuthService.refresh(refreshToken);

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("access_token", sb.get("access_token"));
            response.put("refresh_token", sb.get("refresh_token"));
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Refresh failed: " + e.getMessage()));
        }
    }

    // ================= HELPER =================

    private ResponseEntity<?> badRequest(String msg) {
        return ResponseEntity.badRequest().body(Map.of("error", msg));
    }

    private boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    @SuppressWarnings("unchecked")
    private void upsertLocalUser(Map<String, Object> sb, String fallbackEmail, String fallbackFullName) {
        if (sb == null) {
            userService.upsertByEmail(fallbackEmail, fallbackFullName);
            return;
        }

        Object userObj = sb.get("user");

        if (!(userObj instanceof Map<?, ?> userMap)) {
            userService.upsertByEmail(fallbackEmail, fallbackFullName);
            return;
        }

        String email = (String) ((Map<String, Object>) userMap)
                .getOrDefault("email", fallbackEmail);

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

    private void safeUpsertLocalUser(Map<String, Object> sb, String fallbackEmail, String fallbackFullName) {
        try {
            upsertLocalUser(sb, fallbackEmail, fallbackFullName);
        } catch (RuntimeException e) {
            log.warn("Skipping local user sync because the database is unavailable: {}", e.getMessage());
        }
    }
}
