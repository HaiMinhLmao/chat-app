package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.FriendInviteRequest;
import com.myclass.chat_app.service.SocialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/social")
public class SocialController {

    private final SocialService socialService;

    public SocialController(SocialService socialService) {
        this.socialService = socialService;
    }

    @GetMapping("/state")
    public ResponseEntity<?> getState(@AuthenticationPrincipal Jwt jwt) {
        try {
            return ResponseEntity.ok(socialService.getState(currentEmail(jwt)));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", exception.getMessage()));
        }
    }

    @PostMapping("/friend-requests")
    public ResponseEntity<?> sendFriendRequest(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody FriendInviteRequest request
    ) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(socialService.sendFriendRequest(currentEmail(jwt), request == null ? null : request.email()));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
        }
    }

    @PostMapping("/friend-requests/{requestId}/accept")
    public ResponseEntity<?> acceptFriendRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            return ResponseEntity.ok(socialService.acceptFriendRequest(requestId, currentEmail(jwt)));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
        }
    }

    @PostMapping("/friend-requests/{requestId}/decline")
    public ResponseEntity<?> declineFriendRequest(
            @PathVariable Long requestId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            return ResponseEntity.ok(socialService.declineFriendRequest(requestId, currentEmail(jwt)));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
        }
    }

    @PostMapping("/group-invitations/{invitationId}/accept")
    public ResponseEntity<?> acceptGroupInvitation(
            @PathVariable Long invitationId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            return ResponseEntity.ok(socialService.acceptGroupInvitation(invitationId, currentEmail(jwt)));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
        }
    }

    @PostMapping("/group-invitations/{invitationId}/decline")
    public ResponseEntity<?> declineGroupInvitation(
            @PathVariable Long invitationId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            return ResponseEntity.ok(socialService.declineGroupInvitation(invitationId, currentEmail(jwt)));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
        }
    }

    private String currentEmail(Jwt jwt) {
        return jwt == null ? null : jwt.getClaimAsString("email");
    }
}
