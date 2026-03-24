package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.CreateGroupRequest;
import com.myclass.chat_app.dto.GroupResponse;
import com.myclass.chat_app.dto.GroupSummaryResponse;
import com.myclass.chat_app.dto.RenameGroupRequest;
import com.myclass.chat_app.service.GroupService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/groups")
public class GroupController {

    private static final Logger log = LoggerFactory.getLogger(GroupController.class);

    private final GroupService groupService;

    public GroupController(GroupService groupService) {
        this.groupService = groupService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@AuthenticationPrincipal Jwt jwt, @RequestBody CreateGroupRequest request) {
        try {
            if (request == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Request body is required"));
            }
            String email = jwt == null ? null : jwt.getClaimAsString("email");
            GroupResponse created = groupService.createGroup(email, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            if ("Unauthorized".equalsIgnoreCase(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            log.warn("Group create failed because storage is unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Group storage is temporarily unavailable. Please try again later."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        try {
            String email = jwt == null ? null : jwt.getClaimAsString("email");
            return ResponseEntity.ok(groupService.getGroup(id, email));
        } catch (SecurityException e) {
            return groupSecurityResponse(e);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            log.warn("Group lookup failed because storage is unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Group storage is temporarily unavailable. Please try again later."));
        }
    }

    @PutMapping("/{id}/name")
    public ResponseEntity<?> rename(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody RenameGroupRequest request
    ) {
        try {
            if (request == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Request body is required"));
            }
            String email = jwt == null ? null : jwt.getClaimAsString("email");
            return ResponseEntity.ok(groupService.renameGroup(id, email, request.groupName()));
        } catch (SecurityException e) {
            return groupSecurityResponse(e);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            log.warn("Group rename failed because storage is unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Group storage is temporarily unavailable. Please try again later."));
        }
    }

    @DeleteMapping("/{id}/members/{memberEmail}")
    public ResponseEntity<?> removeMember(
            @PathVariable Long id,
            @PathVariable String memberEmail,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String email = jwt == null ? null : jwt.getClaimAsString("email");
            return ResponseEntity.ok(groupService.removeMember(id, email, memberEmail));
        } catch (SecurityException e) {
            return groupSecurityResponse(e);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            log.warn("Group member removal failed because storage is unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Group storage is temporarily unavailable. Please try again later."));
        }
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<?> leave(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt
    ) {
        try {
            String email = jwt == null ? null : jwt.getClaimAsString("email");
            groupService.leaveGroup(id, email);
            return ResponseEntity.ok(Map.of("message", "Left group."));
        } catch (SecurityException e) {
            return groupSecurityResponse(e);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            log.warn("Group leave failed because storage is unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Group storage is temporarily unavailable. Please try again later."));
        }
    }

    @GetMapping("/mine")
    public ResponseEntity<?> mine(@AuthenticationPrincipal Jwt jwt) {
        try {
            String email = jwt == null ? null : jwt.getClaimAsString("email");
            List<GroupSummaryResponse> groups = groupService.listMyGroups(email);
            return ResponseEntity.ok(groups);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            log.warn("Group list failed because storage is unavailable: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "Groups are temporarily unavailable. You can still use the lobby chat."));
        }
    }

    private ResponseEntity<Map<String, String>> groupSecurityResponse(SecurityException exception) {
        String message = exception.getMessage() == null ? "Forbidden" : exception.getMessage();
        HttpStatus status = "Unauthorized".equalsIgnoreCase(message)
                ? HttpStatus.UNAUTHORIZED
                : HttpStatus.FORBIDDEN;
        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}

