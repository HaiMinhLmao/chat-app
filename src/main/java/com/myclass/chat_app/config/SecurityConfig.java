package com.myclass.chat_app.config;

import com.myclass.chat_app.service.LocalAdminAuthService;
import com.myclass.chat_app.service.LocalUserAuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

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
            @Value("${supabase.anon.key}") String anonKey,
            ObjectMapper objectMapper,
            LocalAdminAuthService localAdminAuthService,
            LocalUserAuthService localUserAuthService
    ) {
        return new CompositeJwtDecoder(
                localAdminAuthService,
                localUserAuthService,
                new SupabaseUserLookupJwtDecoder(supabaseUrl, anonKey, objectMapper)
        );
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
