package com.edusentinel.controller;

import com.edusentinel.dto.LoginRequest;
import com.edusentinel.dto.RegisterRequest;
import com.edusentinel.entity.User;
import com.edusentinel.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // =========================
    // REGISTER
    // =========================
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        try {

            User user = authService.register(request);

            Map<String, Object> response = new HashMap<>();

            response.put("success", true);
            response.put("message", "Registration successful");
            response.put("userId", user.getId());
            response.put("fullName", user.getFullName());
            response.put("email", user.getEmail());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (RuntimeException e) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
        }
    }

    // =========================
    // LOGIN
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        try {

            User user = authService.login(request);

            Map<String, Object> response = new HashMap<>();

            response.put("success", true);
            response.put("message", "Login successful");
            response.put("userId", user.getId());
            response.put("fullName", user.getFullName());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, Object> response = new HashMap<>();

            response.put("success", false);
            response.put("message", e.getMessage());

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }
    }
}