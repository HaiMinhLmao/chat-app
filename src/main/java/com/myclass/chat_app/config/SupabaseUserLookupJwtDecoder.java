package com.myclass.chat_app.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;

public class SupabaseUserLookupJwtDecoder implements JwtDecoder {

    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(8);

    private final WebClient client;
    private final String anonKey;
    private final ObjectMapper objectMapper;

    public SupabaseUserLookupJwtDecoder(String supabaseUrl, String anonKey, ObjectMapper objectMapper) {
        this.anonKey = anonKey;
        this.objectMapper = objectMapper;
        this.client = WebClient.builder()
                .baseUrl(supabaseUrl + "/auth/v1")
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        if (anonKey == null || anonKey.isBlank()) {
            throw new JwtException("Missing Supabase anon key.");
        }
        if (token == null || token.isBlank()) {
            throw new BadJwtException("Missing bearer token.");
        }

        SupabaseUserResponse user = fetchUser(token);
        Map<String, Object> headers = parseTokenPart(token, 0);
        Map<String, Object> claims = new LinkedHashMap<>(parseTokenPart(token, 1));
        if (user.id() != null && !user.id().isBlank()) {
            claims.put("sub", user.id());
        }
        if (user.email() != null && !user.email().isBlank()) {
            claims.put("email", user.email());
        }
        if (user.userMetadata() != null && !user.userMetadata().isEmpty()) {
            claims.put("user_metadata", user.userMetadata());
        }

        Instant issuedAt = extractInstant(claims.get("iat"));
        Instant expiresAt = extractInstant(claims.get("exp"));
        Instant now = Instant.now();

        return new Jwt(
                token,
                issuedAt != null ? issuedAt : now,
                expiresAt != null ? expiresAt : now.plusSeconds(3600),
                headers,
                claims
        );
    }

    private SupabaseUserResponse fetchUser(String token) {
        return client.get()
                .uri("/user")
                .header("apikey", anonKey)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        response -> response.bodyToMono(String.class).defaultIfEmpty("")
                                .flatMap(body -> Mono.error(new BadJwtException(
                                        body == null || body.isBlank()
                                                ? "Supabase rejected the access token."
                                                : "Supabase rejected the access token: " + body
                                )))
                )
                .bodyToMono(SupabaseUserResponse.class)
                .timeout(REQUEST_TIMEOUT)
                .onErrorMap(
                        TimeoutException.class,
                        exception -> new JwtException(
                                "Supabase user lookup timed out after " + REQUEST_TIMEOUT.toSeconds() + " seconds.",
                                exception
                        )
                )
                .onErrorMap(
                        WebClientRequestException.class,
                        exception -> new JwtException("Supabase user lookup failed: " + exception.getMessage(), exception)
                )
                .blockOptional()
                .filter(user -> user.email() != null && !user.email().isBlank())
                .orElseThrow(() -> new BadJwtException("Supabase user lookup did not return an email."));
    }

    private Map<String, Object> parseTokenPart(String token, int partIndex) {
        String[] parts = token.split("\\.");
        if (parts.length <= partIndex) {
            return Map.of();
        }

        try {
            String padded = padBase64(parts[partIndex]);
            byte[] decoded = Base64.getUrlDecoder().decode(padded);
            String json = new String(decoded, StandardCharsets.UTF_8);
            return objectMapper.readValue(json, objectMapper.getTypeFactory().constructMapType(LinkedHashMap.class, String.class, Object.class));
        } catch (Exception exception) {
            return Map.of();
        }
    }

    private String padBase64(String value) {
        int remainder = value.length() % 4;
        if (remainder == 0) {
            return value;
        }
        return value + "=".repeat(4 - remainder);
    }

    private Instant extractInstant(Object value) {
        if (value instanceof Number number) {
            return Instant.ofEpochSecond(number.longValue());
        }
        if (value instanceof String text) {
            try {
                return Instant.ofEpochSecond(Long.parseLong(text));
            } catch (NumberFormatException ignored) {
                return null;
            }
        }
        return null;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record SupabaseUserResponse(
            String id,
            String email,
            @JsonProperty("user_metadata")
            Map<String, Object> userMetadata
    ) {
    }
}
