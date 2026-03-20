package com.myclass.chat_app.config;

import com.myclass.chat_app.service.LocalAdminAuthService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtDecoder jwtDecoder(
            @Value("${supabase.url}") String supabaseUrl,
            @Value("${app.local-auth.jwt-secret:myclassroom-local-demo-secret-please-change-2026}") String localJwtSecret
    ) {
        SecretKeySpec secretKey = new SecretKeySpec(localJwtSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        NimbusJwtDecoder localDecoder = NimbusJwtDecoder.withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        NimbusJwtDecoder supabaseDecoder = NimbusJwtDecoder.withJwkSetUri(supabaseUrl + "/auth/v1/.well-known/jwks.json")
                .build();

        return token -> {
            try {
                Jwt jwt = localDecoder.decode(token);
                if (jwt.getIssuer() != null && LocalAdminAuthService.LOCAL_ISSUER.equals(jwt.getIssuer().toString())) {
                    return jwt;
                }
            } catch (JwtException ignored) {
                // Fall through to Supabase JWT validation below.
            }

            try {
                return supabaseDecoder.decode(token);
            } catch (JwtException exception) {
                throw new BadJwtException("Token could not be verified by local admin auth or Supabase.");
            }
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/login.html",
                                "/register.html",
                                "/create-group.html",
                                "/static/**",
                                "/ws/**",
                                "/api/auth/**"
                        ).permitAll()
                        .requestMatchers("/api/groups/**", "/api/messages/**", "/api/users/**", "/api/social/**").authenticated()
                        .anyRequest().permitAll())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> {}))
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}
