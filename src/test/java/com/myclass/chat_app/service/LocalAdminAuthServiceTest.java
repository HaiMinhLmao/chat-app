package com.myclass.chat_app.service;

import org.junit.jupiter.api.Test;

import java.util.Map;

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

        Map<String, Object> loginResponse = service.login("user", "admin123");
        Map<String, Object> refreshResponse = service.refresh((String) loginResponse.get("refresh_token"));

        assertThat(loginResponse).containsKeys("access_token", "refresh_token", "user");
        assertThat(refreshResponse).containsKeys("access_token", "refresh_token", "user");
        assertThat(((Map<?, ?>) loginResponse.get("user")).get("email")).isEqualTo("user@local.myclass");
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
