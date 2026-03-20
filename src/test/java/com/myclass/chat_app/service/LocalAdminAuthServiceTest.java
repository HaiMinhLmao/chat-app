package com.myclass.chat_app.service;

import com.myclass.chat_app.dto.AuthSessionResponse;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

class LocalAdminAuthServiceTest {

    @Test
    void localAdminCanLoginAndRefreshWithUserAlias() {
        UserService userService = mock(UserService.class);
        LocalAdminAuthService service = new LocalAdminAuthService(
                userService,
                "myclassroom-local-demo-secret-please-change-2026",
                "user",
                "user@local.myclass",
                "Admin",
                "admin123"
        );

        AuthSessionResponse loginResponse = service.login("user", "admin123");
        AuthSessionResponse refreshResponse = service.refresh(loginResponse.refreshToken());

        assertThat(loginResponse.accessToken()).isNotBlank();
        assertThat(loginResponse.refreshToken()).isNotBlank();
        assertThat(loginResponse.user()).isNotNull();
        assertThat(refreshResponse.accessToken()).isNotBlank();
        assertThat(refreshResponse.refreshToken()).isNotBlank();
        assertThat(loginResponse.user().email()).isEqualTo("user@local.myclass");
        verify(userService, times(2)).upsertByEmail("user@local.myclass", "Admin");
    }

    @Test
    void rejectsWrongPassword() {
        UserService userService = mock(UserService.class);
        LocalAdminAuthService service = new LocalAdminAuthService(
                userService,
                "myclassroom-local-demo-secret-please-change-2026",
                "user",
                "user@local.myclass",
                "Admin",
                "admin123"
        );

        assertThatThrownBy(() -> service.login("user", "wrong-password"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Invalid local admin credentials");
    }
}
