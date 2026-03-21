package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.AuthSessionResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeoutException;

@Service
public class SupabaseAuthService {

    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(8);

    private final WebClient client;
    private final String anonKey;

    public SupabaseAuthService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.anon.key}") String anonKey
    ) {
        this.anonKey = anonKey;
        this.client = WebClient.builder()
                .baseUrl(supabaseUrl + "/auth/v1")
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public AuthSessionResponse register(String email, String password, String fullName) {
        validateConfigured();
        return execute("signup", client.post()
                .uri("/signup")
                .header("apikey", anonKey)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + anonKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "email", email,
                        "password", password,
                        "data", Map.of("full_name", fullName == null ? "" : fullName)
                ))
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        response -> response.bodyToMono(String.class).defaultIfEmpty("")
                                .flatMap(body -> Mono.error(new RuntimeException(
                                        "HTTP " + response.statusCode().value() + " from Supabase: " + body
                                )))
                )
                .bodyToMono(AuthSessionResponse.class));
    }

    public AuthSessionResponse login(String email, String password) {
        validateConfigured();
        return execute("login", client.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/token")
                        .queryParam("grant_type", "password")
                        .build())
                .header("apikey", anonKey)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + anonKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "email", email,
                        "password", password
                ))
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        response -> response.bodyToMono(String.class).defaultIfEmpty("")
                                .flatMap(body -> Mono.error(new RuntimeException(
                                        "HTTP " + response.statusCode().value() + " from Supabase: " + body
                                )))
                )
                .bodyToMono(AuthSessionResponse.class));
    }

    public AuthSessionResponse refresh(String refreshToken) {
        validateConfigured();
        return execute("refresh", client.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/token")
                        .queryParam("grant_type", "refresh_token")
                        .build())
                .header("apikey", anonKey)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + anonKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of(
                        "refresh_token", refreshToken
                ))
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        response -> response.bodyToMono(String.class).defaultIfEmpty("")
                                .flatMap(body -> Mono.error(new RuntimeException(
                                        "HTTP " + response.statusCode().value() + " from Supabase: " + body
                                )))
                )
                .bodyToMono(AuthSessionResponse.class));
    }

    private void validateConfigured() {
        if (anonKey == null || anonKey.isBlank()) {
            throw new IllegalStateException(
                    "Missing Supabase anon key. Set environment variable SUPABASE_ANON_KEY (sb_publishable_...)."
            );
        }
    }

    private AuthSessionResponse execute(String operation, Mono<AuthSessionResponse> request) {
        return request
                .timeout(REQUEST_TIMEOUT)
                .onErrorMap(
                        TimeoutException.class,
                        exception -> new RuntimeException(
                                "Supabase " + operation + " timed out after " + REQUEST_TIMEOUT.toSeconds() + " seconds."
                        )
                )
                .onErrorMap(
                        WebClientRequestException.class,
                        exception -> new RuntimeException("Supabase " + operation + " request failed: " + exception.getMessage())
                )
                .block();
    }
}
