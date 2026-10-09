package com.edusentinel.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                // Authentication APIs
                .requestMatchers("/api/auth/**")
                .permitAll()

                // Complaint APIs
                .requestMatchers("/api/complaints/**")
                .permitAll()

                // Evidence APIs
                .requestMatchers("/api/evidence/**")
                .permitAll()

                // Notification APIs
                .requestMatchers("/api/notifications/**")
                .permitAll()

                // Officer APIs
                .requestMatchers("/api/officer/**")
                .permitAll()

                // Browser preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**")
                .permitAll()

                // Frontend files
                .requestMatchers(
                    "/",
                    "/index.html",
                    "/login.html",
                    "/register.html",
                    "/report.html",
                    "/track-complaint.html",
                    "/student-dashboard.html",
                    "/officer-dashboard.html",
                    "/incident-details.html",
                    "/about.html",
                    "/css/**",
                    "/js/**",
                    "/assets/**"
                )
                .permitAll()

                .anyRequest()
                .authenticated()
            );

        return http.build();
    }
}