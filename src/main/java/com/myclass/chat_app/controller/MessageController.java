package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.DirectChatMessage;
import com.myclass.chat_app.dto.GroupChatMessage;
import com.myclass.chat_app.entity.Message;
import com.myclass.chat_app.service.GroupService;
import com.myclass.chat_app.service.MessageService;
import com.myclass.chat_app.service.SocialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final GroupService groupService;
    private final SocialService socialService;

    public MessageController(MessageService messageService, GroupService groupService, SocialService socialService) {
        this.messageService = messageService;
        this.groupService = groupService;
        this.socialService = socialService;
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
}
