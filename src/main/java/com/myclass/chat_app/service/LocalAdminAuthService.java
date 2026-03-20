package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.AuthSessionResponse;
import com.myclass.chat_app.dto.AuthUserMetadataResponse;
import com.myclass.chat_app.dto.AuthUserResponse;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Locale;

@Service
public class LocalAdminAuthService {

    public static final String LOCAL_ISSUER = "myclassroom-local";

    private static final Duration ACCESS_TOKEN_TTL = Duration.ofDays(30);
    private static final Duration REFRESH_TOKEN_TTL = Duration.ofDays(90);

    private final UserService userService;
    private final byte[] jwtSecret;
    private final String primaryLogin;
    private final String adminEmail;
    private final String adminDisplayName;
    private final String adminPassword;

    public LocalAdminAuthService(
            UserService userService,
            @Value("${app.local-auth.jwt-secret:myclassroom-local-demo-secret-please-change-2026}") String jwtSecret,
            @Value("${app.local-auth.admin-login:user}") String primaryLogin,
            @Value("${app.local-auth.admin-email:user@local.myclass}") String adminEmail,
            @Value("${app.local-auth.admin-name:Admin}") String adminDisplayName,
            @Value("${app.local-auth.admin-password:admin123}") String adminPassword
    ) {
        this.userService = userService;
        this.jwtSecret = jwtSecret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        this.primaryLogin = normalize(primaryLogin);
        this.adminEmail = normalize(adminEmail);
        this.adminDisplayName = adminDisplayName == null || adminDisplayName.isBlank() ? "Admin" : adminDisplayName.trim();
        this.adminPassword = adminPassword == null ? "" : adminPassword;
    }

    public boolean supportsIdentifier(String identifier) {
        String normalized = normalize(identifier);
        if (normalized == null) {
            return false;
        }
        return normalized.equals(primaryLogin)
                || normalized.equals("admin")
                || normalized.equals(adminEmail)
                || normalized.equals("admin@local.myclass");
    }

    public AuthSessionResponse login(String identifier, String password) {
        if (!supportsIdentifier(identifier) || !adminPassword.equals(password)) {
            throw new IllegalArgumentException("Invalid local admin credentials.");
        }

        userService.upsertByEmail(adminEmail, adminDisplayName);
        return buildAuthResponse();
    }

    public boolean isLocalToken(String token) {
        try {
            JWTClaimsSet claims = parseClaims(token);
            return LOCAL_ISSUER.equals(claims.getIssuer());
        } catch (RuntimeException exception) {
            return false;
        }
    }

    public AuthSessionResponse refresh(String refreshToken) {
        JWTClaimsSet claims = parseClaims(refreshToken);
        if (!LOCAL_ISSUER.equals(claims.getIssuer())) {
            throw new IllegalArgumentException("This refresh token does not belong to the local admin session.");
        }
        Object tokenType = claims.getClaim("type");
        if (!"refresh".equals(tokenType)) {
            throw new IllegalArgumentException("Invalid refresh token.");
        }
        if (!adminEmail.equalsIgnoreCase(claims.getSubject())) {
            throw new IllegalArgumentException("Unknown local admin account.");
        }

        userService.upsertByEmail(adminEmail, adminDisplayName);
        return buildAuthResponse();
    }

    private AuthSessionResponse buildAuthResponse() {
        String accessToken = issueToken("access");
        String refreshToken = issueToken("refresh");

        AuthUserMetadataResponse userMetadata = new AuthUserMetadataResponse(
                adminDisplayName,
                primaryLogin,
                true,
                "ADMIN"
        );
        AuthUserResponse user = new AuthUserResponse(adminEmail, userMetadata);
        return new AuthSessionResponse(accessToken, refreshToken, user, "local", null);
    }

    private String issueToken(String type) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus("refresh".equals(type) ? REFRESH_TOKEN_TTL : ACCESS_TOKEN_TTL);

        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .issuer(LOCAL_ISSUER)
                .subject(adminEmail)
                .issueTime(Date.from(now))
                .expirationTime(Date.from(expiresAt))
                .claim("email", adminEmail)
                .claim("preferred_username", primaryLogin)
                .claim("name", adminDisplayName)
                .claim("role", "ADMIN")
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
            throw new IllegalStateException("Could not issue local admin token.", exception);
        }
    }

    private JWTClaimsSet parseClaims(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Missing token.");
        }

        try {
            SignedJWT jwt = SignedJWT.parse(token);
            if (!jwt.verify(new MACVerifier(jwtSecret))) {
                throw new IllegalArgumentException("Invalid local admin token.");
            }
            JWTClaimsSet claims = jwt.getJWTClaimsSet();
            Date expiresAt = claims.getExpirationTime();
            if (expiresAt == null || expiresAt.before(new Date())) {
                throw new IllegalArgumentException("Local admin token expired.");
            }
            return claims;
        } catch (ParseException | JOSEException exception) {
            throw new IllegalArgumentException("Invalid local admin token.", exception);
        }
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim().toLowerCase(Locale.ROOT);
        return normalized.isBlank() ? null : normalized;
    }
}
