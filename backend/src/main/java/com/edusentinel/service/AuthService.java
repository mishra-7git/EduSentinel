package com.edusentinel.service;

import com.edusentinel.dto.LoginRequest;
import com.edusentinel.dto.RegisterRequest;
import com.edusentinel.entity.User;
import com.edusentinel.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // =========================
    // REGISTER
    // =========================
    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number is already registered");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setInstitution(request.getInstitution());
        user.setQualification(request.getQualification());
        user.setLevel(request.getLevel());
        user.setAccountType(request.getAccountType());

        // Password will be stored in encrypted form
        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole("STUDENT");

        return userRepository.save(user);
    }

    // =========================
    // LOGIN
    // =========================
    public User login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            throw new RuntimeException("Invalid email or password");
        }

        return user;
    }
}