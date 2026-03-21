package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.AuthErrorResponse;
import com.myclass.chat_app.dto.AuthRefreshRequest;
import com.myclass.chat_app.dto.AuthRequest;
import com.myclass.chat_app.dto.AuthSessionResponse;
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

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final SupabaseAuthService supabaseAuthService;
    private final UserService userService;

    public AuthController(
            SupabaseAuthService supabaseAuthService,
            UserService userService
    ) {
        this.supabaseAuthService = supabaseAuthService;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody(required = false) AuthRequest request) {
        try {
            if (request == null) {
                return badRequest("Request body is required");
            }

            if (!request.hasEmailAndPassword()) {
                return badRequest("Email and password are required");
            }

            String identifier = request.trimmedIdentifier();
            String fullName = request.safeFullName();
            AuthSessionResponse supabaseResponse = supabaseAuthService.register(identifier, request.password(), fullName);
            safeUpsertLocalUser(supabaseResponse, identifier, fullName);
            return ResponseEntity.status(HttpStatus.CREATED).body(supabaseResponse);
        } catch (Exception e) {
            String message = e.getMessage() == null ? "" : e.getMessage();
            if (isInvalidEmailError(message)) {
                return badRequest("Email is invalid. Please enter a real email address like name@gmail.com, not just a username.");
            }
            if (message.contains("user_already_exists")) {
                return badRequest("This email is already registered. Please sign in instead.");
            }
            if (isSupabaseUnavailable(message)) {
                return supabaseUnavailableResponse();
            }
            if (isDatabaseUnavailable(message)) {
                return databaseUnavailableResponse();
            }
            return badRequest(message);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody(required = false) AuthRequest request) {
        try {
            if (request == null) {
                return badRequest("Request body is required");
            }

            if (!request.hasEmailAndPassword()) {
                return badRequest("Email and password are required");
            }

            String identifier = request.trimmedIdentifier();
            String password = request.password();
            AuthSessionResponse supabaseResponse = supabaseAuthService.login(identifier, password);
            safeUpsertLocalUser(supabaseResponse, identifier, null);
            return ResponseEntity.ok(supabaseResponse);
        } catch (Exception e) {
            String message = e.getMessage() == null ? "" : e.getMessage();
            if (isSupabaseUnavailable(message)) {
                return supabaseUnavailableResponse();
            }
            if (isDatabaseUnavailable(message)) {
                return databaseUnavailableResponse();
            }
            if (message.contains("invalid_credentials")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(errorResponse("Invalid login credentials."));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(errorResponse("Login failed: " + message));
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody(required = false) AuthRefreshRequest request) {
        try {
            if (request == null) {
                return badRequest("Request body is required");
            }

            if (!request.hasRefreshToken()) {
                return badRequest("Missing refresh_token");
            }

            String refreshToken = request.trimmedRefreshToken();
            return ResponseEntity.ok(supabaseAuthService.refresh(refreshToken).toTokenPair());
        } catch (Exception e) {
            String message = e.getMessage() == null ? "" : e.getMessage();
            if (isSupabaseUnavailable(message)) {
                return supabaseUnavailableResponse();
            }
            if (isDatabaseUnavailable(message)) {
                return databaseUnavailableResponse();
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(errorResponse("Refresh failed: " + message));
        }
    }

    private ResponseEntity<?> badRequest(String msg) {
        return ResponseEntity.badRequest().body(errorResponse(msg));
    }

    private AuthErrorResponse errorResponse(String message) {
        return new AuthErrorResponse(message);
    }

    private boolean isInvalidEmailError(String message) {
        return message.contains("email_address_invalid")
                || message.contains("validation_failed")
                || message.contains("invalid format");
    }

    private boolean isSupabaseUnavailable(String message) {
        if (message == null) {
            return false;
        }
        return isInvalidSupabaseApiKeyError(message)
                || message.contains("Missing Supabase anon key")
                || message.contains("HTTP 5")
                || message.contains("timed out")
                || message.contains("Connection reset")
                || message.contains("Connection refused")
                || message.contains("Name or service not known")
                || message.contains("UnknownHostException")
                || message.contains("request failed");
    }

    private boolean isInvalidSupabaseApiKeyError(String message) {
        return message.contains("Invalid API key")
                || message.contains("invalid api key")
                || message.contains("\"Invalid API key\"");
    }

    private boolean isDatabaseUnavailable(String message) {
        if (message == null) {
            return false;
        }
        return message.contains("Unable to acquire JDBC Connection")
                || message.contains("Connection is not available")
                || message.contains("request timed out after")
                || message.contains("Communications link failure")
                || message.contains("Connection refused");
    }

    private ResponseEntity<AuthErrorResponse> databaseUnavailableResponse() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse(
                "The app cannot reach the database right now. On deployment, point Spring Boot at the Supabase session pooler on port 5432 and redeploy."
        ));
    }

    private ResponseEntity<AuthErrorResponse> supabaseUnavailableResponse() {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse(
                "Supabase Auth is unavailable or misconfigured right now. Check SUPABASE_ANON_KEY and try again."
        ));
    }

    private void upsertLocalUser(AuthSessionResponse authResponse, String fallbackEmail, String fallbackFullName) {
        if (authResponse == null) {
            userService.upsertByEmail(fallbackEmail, fallbackFullName);
            return;
        }
        userService.upsertByEmail(
                authResponse.resolvedEmail(fallbackEmail),
                authResponse.resolvedFullName(fallbackFullName)
        );
    }

    private void safeUpsertLocalUser(AuthSessionResponse authResponse, String fallbackEmail, String fallbackFullName) {
        try {
            upsertLocalUser(authResponse, fallbackEmail, fallbackFullName);
        } catch (RuntimeException e) {
            log.warn("Skipping local user sync because the database is unavailable: {}", e.getMessage());
        }
    }
}
