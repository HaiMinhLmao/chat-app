package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.AuthErrorResponse;
import com.myclass.chat_app.dto.AuthRefreshRequest;
import com.myclass.chat_app.dto.AuthRequest;
import com.myclass.chat_app.dto.AuthSessionResponse;
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
            if (shouldUseLocalRegistrationFallback(message)) {
                return registerUsingLocalFallback(request);
            }
            if (message.contains("user_already_exists")) {
                return badRequest("This email is already registered in the current Supabase project. Please sign in instead.");
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

            if (localAdminAuthService.supportsIdentifier(identifier)) {
                AuthSessionResponse localResponse = localAdminAuthService.login(identifier, password);
                safeUpsertLocalUser(localResponse, "user@local.myclass", "Admin");
                return ResponseEntity.ok(localResponse);
            }

            try {
                AuthSessionResponse supabaseResponse = supabaseAuthService.login(identifier, password);
                safeUpsertLocalUser(supabaseResponse, identifier, null);
                return ResponseEntity.ok(supabaseResponse);
            } catch (Exception supabaseLoginError) {
                try {
                    AuthSessionResponse localResponse = localUserAuthService.login(identifier, password);
                    safeUpsertLocalUser(localResponse, identifier, null);
                    return ResponseEntity.ok(localResponse);
                } catch (IllegalArgumentException ignored) {
                    throw supabaseLoginError;
                } catch (RuntimeException localDbError) {
                    log.warn("Skipping local user auth fallback because the database is unavailable: {}", localDbError.getMessage());
                    throw localDbError;
                }
            }

        } catch (Exception e) {
            String message = e.getMessage() == null ? "" : e.getMessage();
            if (isInvalidSupabaseApiKeyError(message)) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse(
                        "Supabase Auth is misconfigured on this deployment. This build already has a fallback publishable key, so a stale SUPABASE_ANON_KEY environment variable is likely overriding it. Replace or remove that env var and redeploy, or register again and the app will use local database auth for that email."
                ));
            }
            if (isDatabaseUnavailable(message)) {
                return databaseUnavailableResponse();
            }
            if (message.contains("invalid_credentials")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse(
                        "Invalid login credentials. If Supabase email signup was rate-limited, register again and the app will create a local database account for this email."
                ));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(errorResponse("Invalid credentials: " + message));
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
            if (localAdminAuthService.isLocalToken(refreshToken)) {
                return ResponseEntity.ok(localAdminAuthService.refresh(refreshToken).toTokenPair());
            }
            if (localUserAuthService.isLocalToken(refreshToken)) {
                return ResponseEntity.ok(localUserAuthService.refresh(refreshToken).toTokenPair());
            }

            return ResponseEntity.ok(supabaseAuthService.refresh(refreshToken).toTokenPair());

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(errorResponse("Refresh failed: " + e.getMessage()));
        }
    }

    private ResponseEntity<?> badRequest(String msg) {
        return ResponseEntity.badRequest().body(errorResponse(msg));
    }

    private AuthErrorResponse errorResponse(String message) {
        return new AuthErrorResponse(message);
    }

    private AuthSessionResponse registerLocally(AuthRequest request) {
        return localUserAuthService.register(
                request == null ? null : request.trimmedIdentifier(),
                request == null ? null : request.password(),
                request == null ? "" : request.safeFullName()
        );
    }

    private ResponseEntity<?> registerUsingLocalFallback(AuthRequest request) {
        try {
            AuthSessionResponse fallbackResponse = registerLocally(request);
            safeUpsertLocalUser(
                    fallbackResponse,
                    request == null ? null : request.trimmedIdentifier(),
                    request == null ? "" : request.safeFullName()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(fallbackResponse);
        } catch (IllegalArgumentException validationError) {
            return badRequest(validationError.getMessage());
        } catch (RuntimeException databaseError) {
            if (isDatabaseUnavailable(databaseError.getMessage())) {
                return databaseUnavailableResponse();
            }
            throw databaseError;
        }
    }

    private boolean shouldUseLocalRegistrationFallback(String message) {
        return message.contains("over_email_send_rate_limit")
                || isInvalidSupabaseApiKeyError(message)
                || message.contains("Missing Supabase anon key")
                || isSupabaseTemporaryFailure(message);
    }

    private boolean isInvalidEmailError(String message) {
        return message.contains("email_address_invalid")
                || message.contains("validation_failed")
                || message.contains("invalid format");
    }

    private boolean isInvalidSupabaseApiKeyError(String message) {
        return message.contains("Invalid API key")
                || message.contains("invalid api key")
                || message.contains("\"Invalid API key\"");
    }

    private boolean isSupabaseTemporaryFailure(String message) {
        return message.contains("Supabase signup error")
                && (message.contains("HTTP 5")
                || message.contains("timed out")
                || message.contains("Connection reset")
                || message.contains("Connection refused")
                || message.contains("Name or service not known")
                || message.contains("UnknownHostException")
                || message.contains("Temporary failure"));
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
