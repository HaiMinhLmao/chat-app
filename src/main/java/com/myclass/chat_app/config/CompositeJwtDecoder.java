package com.myclass.chat_app.config;

import com.myclass.chat_app.service.LocalAdminAuthService;
import com.myclass.chat_app.service.LocalUserAuthService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;

public class CompositeJwtDecoder implements JwtDecoder {

    private final LocalAdminAuthService localAdminAuthService;
    private final LocalUserAuthService localUserAuthService;
    private final JwtDecoder supabaseJwtDecoder;

    public CompositeJwtDecoder(
            LocalAdminAuthService localAdminAuthService,
            LocalUserAuthService localUserAuthService,
            JwtDecoder supabaseJwtDecoder
    ) {
        this.localAdminAuthService = localAdminAuthService;
        this.localUserAuthService = localUserAuthService;
        this.supabaseJwtDecoder = supabaseJwtDecoder;
    }

    @Override
    public Jwt decode(String token) throws JwtException {
        if (localAdminAuthService.isLocalToken(token)) {
            return localAdminAuthService.decode(token);
        }
        if (localUserAuthService.isLocalToken(token)) {
            return localUserAuthService.decode(token);
        }
        return supabaseJwtDecoder.decode(token);
    }
}
