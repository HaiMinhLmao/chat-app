package com.myclass.chat_app.service;

import com.myclass.chat_app.entity.LocalCredential;
import com.myclass.chat_app.entity.User;
import com.myclass.chat_app.repository.LocalCredentialRepository;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class LocalUserAuthService {

    public static final String LOCAL_USER_ISSUER = "myclassroom-local-user";

    private static final Duration ACCESS_TOKEN_TTL = Duration.ofDays(30);
    private static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(90);

    private final UserService userService;
    private final LocalCredentialRepository localCredentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final byte[] jwtSecret;

    public LocalUserAuthService(
            UserService userService,
            LocalCredentialRepository localCredentialRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.local-auth.jwt-secret:myclassroom-local-demo-secret-please-change-2026}") String jwtSecret
    ) {
        this.userService = userService;
        this.localCredentialRepository = localCredentialRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtSecret = jwtSecret.getBytes(StandardCharsets.UTF_8);
    }

    public boolean supportsIdentifier(String identifier) {
        String normalized = normalize(identifier);
        if (normalized == null) {
            return false;
        }
        try {
            return localCredentialRepository.existsByUserEmailIgnoreCase(normalized);
        } catch (RuntimeException exception) {
            return false;
        }
    }

    public Map<String, Object> register(String email, String password, String fullName) {
        String normalizedEmail = normalize(email);
        if (normalizedEmail == null) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }
        if (localCredentialRepository.existsByUserEmailIgnoreCase(normalizedEmail)) {
            throw new IllegalArgumentException("This email is already registered locally. Please sign in instead.");
        }

        User user = userService.upsertByEmail(normalizedEmail, fullName);
        LocalCredential credential = new LocalCredential();
        credential.setUser(user);
        credential.setPasswordHash(passwordEncoder.encode(password));
        localCredentialRepository.save(credential);

        return buildAuthResponse(user);
    }

    public Map<String, Object> login(String email, String password) {
        LocalCredential credential = loadCredential(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid local credentials."));

        if (!passwordEncoder.matches(password == null ? "" : password, credential.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid local credentials.");
        }

        User user = credential.getUser();
        userService.upsertByEmail(user.getEmail(), user.getFullName());
        return buildAuthResponse(user);
    }

    public boolean isLocalToken(String token) {
        try {
            JWTClaimsSet claims = parseClaims(token);
            return LOCAL_USER_ISSUER.equals(claims.getIssuer());
        } catch (RuntimeException exception) {
            return false;
        }
    }

    public Map<String, Object> refresh(String refreshToken) {
        JWTClaimsSet claims = parseClaims(refreshToken);
        if (!LOCAL_USER_ISSUER.equals(claims.getIssuer())) {
            throw new IllegalArgumentException("This refresh token does not belong to a local user session.");
        }
        if (!"refresh".equals(claims.getClaim("type"))) {
            throw new IllegalArgumentException("Invalid refresh token.");
        }

        String email = normalize(claims.getSubject());
        LocalCredential credential = loadCredential(email)
                .orElseThrow(() -> new IllegalArgumentException("Unknown local account."));
        return buildAuthResponse(credential.getUser());
    }

    private Map<String, Object> buildAuthResponse(User user) {
        String email = normalize(user.getEmail());
        String fullName = displayName(user);
        String username = defaultDisplayName(email);

        Map<String, Object> userMetadata = new LinkedHashMap<>();
        userMetadata.put("full_name", fullName);
        userMetadata.put("username", username);
        userMetadata.put("local_auth", true);
        userMetadata.put("role", "USER");

        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("email", email);
        userMap.put("user_metadata", userMetadata);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("access_token", issueToken(email, username, fullName, "access"));
        response.put("refresh_token", issueToken(email, username, fullName, "refresh"));
        response.put("user", userMap);
        response.put("mode", "local");
        response.put("message", "Supabase email auth is temporarily unavailable, so this account is using the project's local database auth.");
        return response;
    }

    private String issueToken(String email, String username, String fullName, String type) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus("refresh".equals(type) ? REFRESH_TOKEN_TTL : ACCESS_TOKEN_TTL);

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer(LOCAL_USER_ISSUER)
                .subject(email)
                .issueTime(Date.from(now))
                .expirationTime(Date.from(expiresAt))
                .claim("email", email)
                .claim("preferred_username", username)
                .claim("name", fullName)
                .claim("role", "USER")
                .claim("type", type)
                .build();

        SignedJWT jwt = new SignedJWT(
                new JWSHeader.Builder(JWSAlgorithm.HS256)
                        .type(JOSEObjectType.JWT)
                        .build(),
                claims
        );

        try {
            jwt.sign(new MACSigner(jwtSecret));
            return jwt.serialize();
        } catch (JOSEException exception) {
            throw new IllegalStateException("Could not issue local user token.", exception);
        }
    }

    private JWTClaimsSet parseClaims(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Missing token.");
        }

        try {
            SignedJWT jwt = SignedJWT.parse(token);
            if (!jwt.verify(new MACVerifier(jwtSecret))) {
                throw new IllegalArgumentException("Invalid local user token.");
            }
            JWTClaimsSet claims = jwt.getJWTClaimsSet();
            Date expiresAt = claims.getExpirationTime();
            if (expiresAt == null || expiresAt.before(new Date())) {
                throw new IllegalArgumentException("Local user token expired.");
            }
            return claims;
        } catch (ParseException | JOSEException exception) {
            throw new IllegalArgumentException("Invalid local user token.", exception);
        }
    }

    private Optional<LocalCredential> loadCredential(String email) {
        String normalized = normalize(email);
        if (normalized == null) {
            return Optional.empty();
        }
        return localCredentialRepository.findByUserEmailIgnoreCase(normalized);
    }

    private String displayName(User user) {
        if (user.getFullName() != null && !user.getFullName().isBlank()) {
            return user.getFullName().trim();
        }
        return defaultDisplayName(user.getEmail());
    }

    private String defaultDisplayName(String email) {
        int index = email.indexOf('@');
        return index > 0 ? email.substring(0, index) : email;
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return normalized.isBlank() ? null : normalized;
    }
}
