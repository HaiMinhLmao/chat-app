package com.myclass.chat_app.controller;

import com.myclass.chat_app.dto.UpdateProfileRequest;
import com.myclass.chat_app.dto.UserResponse;
import com.myclass.chat_app.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class UserControllerTest {

    @Test
    void listUsersPassesAuthenticatedEmailToService() {
        UserService userService = mock(UserService.class);
        Jwt jwt = mock(Jwt.class);
        List<UserResponse> users = List.of(new UserResponse(1L, "Minh", "minh@example.com", "Minh", null, null, "vi"));
        when(jwt.getClaimAsString("email")).thenReturn("viewer@example.com");
        when(userService.listUsers("viewer@example.com")).thenReturn(users);

        UserController controller = new UserController(userService);

        ResponseEntity<List<UserResponse>> response = controller.listUsers(jwt);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(users);
    }

    @Test
    void updateMeReturnsUnauthorizedWithoutEmailClaim() {
        UserService userService = mock(UserService.class);
        UserController controller = new UserController(userService);

        ResponseEntity<?> response = controller.updateMe(null, new UpdateProfileRequest("Minh Quang", null, null, "vi"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void updateMeReturnsBadRequestWhenDisplayNameIsBlank() {
        UserService userService = mock(UserService.class);
        Jwt jwt = mock(Jwt.class);
        when(jwt.getClaimAsString("email")).thenReturn("minh@example.com");

        UserController controller = new UserController(userService);

        ResponseEntity<?> response = controller.updateMe(jwt, new UpdateProfileRequest("   ", null, null, "vi"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void updateMeReturnsUpdatedProfile() {
        UserService userService = mock(UserService.class);
        Jwt jwt = mock(Jwt.class);
        UpdateProfileRequest request = new UpdateProfileRequest("Minh Quang", null, null, "vi");
        UserResponse updated = new UserResponse(7L, "Minh Quang", "minh@example.com", "Minh Quang", null, null, "vi");
        when(jwt.getClaimAsString("email")).thenReturn("minh@example.com");
        when(userService.updateProfile("minh@example.com", request)).thenReturn(updated);

        UserController controller = new UserController(userService);

        ResponseEntity<?> response = controller.updateMe(jwt, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(updated);
    }
}
