package com.myclass.chat_app.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Map;

@Service
public class SupabaseAuthService {

    private final WebClient client;

    public SupabaseAuthService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.anon.key}") String anonKey
    ) {
        this.client = WebClient.builder()
                .baseUrl(supabaseUrl + "/auth/v1")
                .defaultHeader("apikey", anonKey)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + anonKey)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public Map<String, Object> register(String email, String password, String fullName) {
        return client.post()
                .uri("/signup")
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
                .bodyToMono(Map.class)
                .onErrorResume(e -> Mono.error(new RuntimeException("Supabase signup error: " + e.getMessage())))
                .block();
    }

    public Map<String, Object> login(String email, String password) {
        return client.post()
                .uri(uriBuilder -> uriBuilder
                        .path("/token")
                        .queryParam("grant_type", "password")
                        .build())
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
                .bodyToMono(Map.class)
                .onErrorResume(e -> Mono.error(new RuntimeException("Supabase login error: " + e.getMessage())))
                .block();
    }
}

