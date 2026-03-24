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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Objects;

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
        String currentEmail = currentEmail(jwt);
        if (!groupService.isMember(groupId, currentEmail)) {
            return errorResponse(HttpStatus.FORBIDDEN, "You are not a member of this group.");
        }
        return ResponseEntity.ok(messageService.getGroupMessages(groupId));
    }

    @GetMapping("/direct/{otherEmail}")
    public ResponseEntity<?> directHistory(
            @PathVariable String otherEmail,
            @AuthenticationPrincipal Jwt jwt
    ) {
        String currentEmail = currentEmail(jwt);
        if (!socialService.areFriends(currentEmail, otherEmail)) {
            return errorResponse(HttpStatus.FORBIDDEN, "Direct messages unlock after the friend request is accepted.");
        }
        return ResponseEntity.ok(messageService.getDirectMessages(currentEmail, otherEmail));
    }

    @PostMapping("/direct/{otherEmail}")
    public ResponseEntity<?> sendDirectMessage(
            @PathVariable String otherEmail,
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody(required = false) DirectChatMessage message
    ) {
        String currentEmail = currentEmail(jwt);
        if (currentEmail == null || currentEmail.isBlank()) {
            return errorResponse(HttpStatus.UNAUTHORIZED, "Sign in again.");
        }
        if (!socialService.areFriends(currentEmail, otherEmail)) {
            return errorResponse(HttpStatus.FORBIDDEN, "Direct messages unlock after the friend request is accepted.");
        }
        String conversationKey = messageService.buildConversationKey(currentEmail, otherEmail);
        DirectChatMessage saved = messageService.saveDirectMessage(
                conversationKey,
                new DirectChatMessage(
                        conversationKey,
                        currentEmail,
                        currentName(jwt),
                        otherEmail,
                        message == null ? null : message.content(),
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                )
        );
        if (saved == null) {
            return errorResponse(HttpStatus.BAD_REQUEST, "Message content is required.");
        }
        messagingTemplate.convertAndSend("/topic/direct/" + saved.conversationKey(), saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping(value = "/direct/{otherEmail}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadDirectAttachment(
            @PathVariable String otherEmail,
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption
    ) {
        String currentEmail = currentEmail(jwt);
        if (currentEmail == null || currentEmail.isBlank()) {
            return errorResponse(HttpStatus.UNAUTHORIZED, "Sign in again.");
        }
        if (!socialService.areFriends(currentEmail, otherEmail)) {
            return errorResponse(HttpStatus.FORBIDDEN, "Direct messages unlock after the friend request is accepted.");
        }
        return handleAttachmentUpload(() -> {
            DirectChatMessage saved = Objects.requireNonNull(messageService.saveDirectAttachment(
                    currentEmail,
                    currentName(jwt),
                    otherEmail,
                    caption,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getBytes()
            ));
            messagingTemplate.convertAndSend("/topic/direct/" + saved.conversationKey(), saved);
            return saved;
        });
    }

    @PostMapping(value = "/groups/{groupId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadGroupAttachment(
            @PathVariable Long groupId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "caption", required = false) String caption
    ) {
        String currentEmail = currentEmail(jwt);
        if (currentEmail == null || currentEmail.isBlank()) {
            return errorResponse(HttpStatus.UNAUTHORIZED, "Sign in again.");
        }
        if (!groupService.isMember(groupId, currentEmail)) {
            return errorResponse(HttpStatus.FORBIDDEN, "You are not a member of this group.");
        }
        return handleAttachmentUpload(() -> {
            GroupChatMessage saved = Objects.requireNonNull(messageService.saveGroupAttachment(
                    groupId,
                    currentEmail,
                    currentName(jwt),
                    caption,
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getBytes()
            ));
            messagingTemplate.convertAndSend("/topic/groups/" + groupId, saved);
            return saved;
        });
    }

    @PostMapping("/groups/{groupId}")
    public ResponseEntity<?> sendGroupMessage(
            @PathVariable Long groupId,
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody(required = false) GroupChatMessage message
    ) {
        String currentEmail = currentEmail(jwt);
        if (currentEmail == null || currentEmail.isBlank()) {
            return errorResponse(HttpStatus.UNAUTHORIZED, "Sign in again.");
        }
        if (!groupService.isMember(groupId, currentEmail)) {
            return errorResponse(HttpStatus.FORBIDDEN, "You are not a member of this group.");
        }
        GroupChatMessage saved = messageService.saveGroupMessage(
                groupId,
                new GroupChatMessage(
                        groupId,
                        currentEmail,
                        currentName(jwt),
                        message == null ? null : message.content(),
                        null,
                        null,
                        null,
                        null,
                        null,
                        null
                )
        );
        if (saved == null) {
            return errorResponse(HttpStatus.BAD_REQUEST, "Message content is required.");
        }
        messagingTemplate.convertAndSend("/topic/groups/" + groupId, saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    private ResponseEntity<?> handleAttachmentUpload(AttachmentSupplier<?> supplier) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(supplier.get());
        } catch (IllegalArgumentException exception) {
            return errorResponse(HttpStatus.BAD_REQUEST, exception.getMessage());
        } catch (IllegalStateException exception) {
            return errorResponse(HttpStatus.SERVICE_UNAVAILABLE, exception.getMessage());
        } catch (IOException exception) {
            return errorResponse(HttpStatus.BAD_REQUEST, "Could not read the uploaded file.");
        }
    }

    private ResponseEntity<Map<String, String>> errorResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("error", message));
    }

    private String currentEmail(Jwt jwt) {
        return jwt == null ? null : jwt.getClaimAsString("email");
    }

    private String currentName(Jwt jwt) {
        return jwt == null ? null : jwt.getClaimAsString("name");
    }

    @FunctionalInterface
    private interface AttachmentSupplier<T> {
        T get() throws IOException;
    }
}
