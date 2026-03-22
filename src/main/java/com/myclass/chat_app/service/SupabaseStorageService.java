package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.StorageSignedUrlResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriUtils;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    private final WebClient client;
    private final String supabaseUrl;
    private final String serviceRoleKey;
    private final String bucket;
    private final int signedUrlSeconds;

    public SupabaseStorageService(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${supabase.service.role.key:}") String serviceRoleKey,
            @Value("${supabase.storage.bucket:chat-attachments}") String bucket,
            @Value("${supabase.storage.signed-url-seconds:3600}") int signedUrlSeconds
    ) {
        this.supabaseUrl = supabaseUrl;
        this.serviceRoleKey = serviceRoleKey;
        this.bucket = bucket;
        this.signedUrlSeconds = signedUrlSeconds;
        this.client = WebClient.builder()
                .baseUrl(supabaseUrl + "/storage/v1")
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    public boolean isConfigured() {
        return serviceRoleKey != null && !serviceRoleKey.isBlank();
    }

    public String uploadDirectAttachment(String conversationKey, String originalFilename, byte[] bytes, String contentType) {
        validateConfigured();
        String objectPath = "direct/" + sanitizePathSegment(conversationKey) + "/" + buildObjectName(originalFilename);
        String encodedPath = encodeObjectPath(objectPath);

        client.post()
                .uri("/object/" + encodePathSegment(bucket) + "/" + encodedPath)
                .header("apikey", serviceRoleKey)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .header("x-upsert", "false")
                .contentType(resolveContentType(contentType))
                .bodyValue(bytes)
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        response -> response.bodyToMono(String.class).defaultIfEmpty("")
                                .flatMap(body -> Mono.error(new RuntimeException(
                                        "Supabase Storage upload failed: HTTP " + response.statusCode().value() + " " + body
                                )))
                )
                .bodyToMono(String.class)
                .block();

        return objectPath;
    }

    public String createSignedDownloadUrl(String objectPath) {
        validateConfigured();
        String encodedPath = encodeObjectPath(objectPath);
        StorageSignedUrlResponse response = client.post()
                .uri("/object/sign/" + encodePathSegment(bucket) + "/" + encodedPath)
                .header("apikey", serviceRoleKey)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceRoleKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(Map.of("expiresIn", signedUrlSeconds))
                .retrieve()
                .onStatus(
                        status -> status.isError(),
                        res -> res.bodyToMono(String.class).defaultIfEmpty("")
                                .flatMap(body -> Mono.error(new RuntimeException(
                                        "Supabase Storage signed URL failed: HTTP " + res.statusCode().value() + " " + body
                                )))
                )
                .bodyToMono(StorageSignedUrlResponse.class)
                .block();

        if (response == null || response.resolvedSignedUrl() == null || response.resolvedSignedUrl().isBlank()) {
            throw new IllegalStateException("Supabase Storage did not return a signed URL.");
        }
        return supabaseUrl + "/storage/v1" + response.resolvedSignedUrl();
    }

    private void validateConfigured() {
        if (!isConfigured()) {
            throw new IllegalStateException(
                    "Supabase Storage is not configured. Set SUPABASE_SERVICE_ROLE_KEY and create the configured bucket."
            );
        }
    }

    private String buildObjectName(String originalFilename) {
        String safeName = sanitizeFileName(originalFilename);
        return Instant.now().toEpochMilli() + "-" + UUID.randomUUID() + "-" + safeName;
    }

    private String sanitizeFileName(String originalFilename) {
        String candidate = originalFilename == null || originalFilename.isBlank() ? "attachment" : originalFilename.trim();
        return candidate.replaceAll("[^A-Za-z0-9._-]", "_");
    }

    private String sanitizePathSegment(String segment) {
        return (segment == null || segment.isBlank() ? "conversation" : segment).replaceAll("[^A-Za-z0-9._-]", "_");
    }

    private String encodeObjectPath(String path) {
        return UriUtils.encodePath(path, StandardCharsets.UTF_8);
    }

    private String encodePathSegment(String value) {
        return UriUtils.encodePathSegment(value, StandardCharsets.UTF_8);
    }

    private MediaType resolveContentType(String contentType) {
        try {
            return contentType == null || contentType.isBlank()
                    ? MediaType.APPLICATION_OCTET_STREAM
                    : MediaType.parseMediaType(contentType);
        } catch (IllegalArgumentException ignored) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
