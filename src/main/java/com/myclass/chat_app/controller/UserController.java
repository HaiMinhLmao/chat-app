package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.UpdateProfileRequest;
import com.myclass.chat_app.dto.UserResponse;
import com.myclass.chat_app.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> listUsers(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt == null ? null : jwt.getClaimAsString("email");
        return ResponseEntity.ok(userService.listUsers(email));
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateMe(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody(required = false) UpdateProfileRequest request
    ) {
        String email = jwt == null ? null : jwt.getClaimAsString("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Unauthorized"));
        }
        if (request == null || request.fullName() == null || request.fullName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Display name is required"));
        }
        try {
            return ResponseEntity.ok(userService.updateProfile(email, request.fullName()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
