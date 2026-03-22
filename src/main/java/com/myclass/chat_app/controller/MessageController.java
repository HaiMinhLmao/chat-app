package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.DirectChatMessage;
import com.myclass.chat_app.dto.GroupChatMessage;
import com.myclass.chat_app.entity.Message;
import com.myclass.chat_app.service.GroupService;
import com.myclass.chat_app.service.MessageService;
import com.myclass.chat_app.service.SocialService;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final GroupService groupService;
    private final SocialService socialService;
    private final SimpMessagingTemplate messagingTemplate;

    public MessageController(
            MessageService messageService,
            GroupService groupService,
            SocialService socialService,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.messageService = messageService;
        this.groupService = groupService;
        this.socialService = socialService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/lobby")
    public ResponseEntity<List<Message>> lobbyHistory() {
        return ResponseEntity.ok(messageService.getLobbyMessages());
    }

    @GetMapping("/groups/{groupId}")
    public ResponseEntity<?> groupHistory(
            @PathVariable Long groupId,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String currentEmail = jwt == null ? null : jwt.getClaimAsString("email");
        if (!groupService.isMember(groupId, currentEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not a member of this group."));
        }
        return ResponseEntity.ok(messageService.getGroupMessages(groupId));
    }

    @GetMapping("/direct/{otherEmail}")
    public ResponseEntity<?> directHistory(
            @PathVariable String otherEmail,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String currentEmail = jwt == null ? null : jwt.getClaimAsString("email");
        if (!socialService.areFriends(currentEmail, otherEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Direct messages unlock after the friend request is accepted."));
        }
        return ResponseEntity.ok(messageService.getDirectMessages(currentEmail, otherEmail));
    }

    @PostMapping(value = "/direct/{otherEmail}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDirectAttachment(
            @PathVariable String otherEmail,
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption
    ) {
        String currentEmail = jwt == null ? null : jwt.getClaimAsString("email");
        if (currentEmail == null || currentEmail.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Sign in again."));
        }
        if (!socialService.areFriends(currentEmail, otherEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Direct messages unlock after the friend request is accepted."));
        }
        try {
            DirectChatMessage saved = messageService.saveDirectAttachment(
                    currentEmail,
                    jwt == null ? null : jwt.getClaimAsString("name"),
                    otherEmail,
                    caption,
                    file == null ? null : file.getOriginalFilename(),
                    file == null ? null : file.getContentType(),
                    file == null ? null : file.getBytes()
            );
            messagingTemplate.convertAndSend("/topic/direct/" + saved.conversationKey(), saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(Map.of("error", exception.getMessage()));
        } catch (IllegalStateException exception) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", exception.getMessage()));
        } catch (IOException exception) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Could not read the uploaded file."));
        }
    }
}
