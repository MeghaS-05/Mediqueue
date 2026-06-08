package com.mediqueue.service;

import com.mediqueue.dto.AuthResponse;
import com.mediqueue.dto.LoginRequest;
import com.mediqueue.dto.RegisterRequest;
import com.mediqueue.model.User;
import com.mediqueue.repository.UserRepository;
import com.mediqueue.security.JwtUtil;
import com.mediqueue.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;

    // ── REGISTER ──────────────────────────────────────────────────
    public AuthResponse register(RegisterRequest request) {

        // 1. check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // 2. create user object
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                // BCrypt encrypts: "123456" → "$2a$10$xyz..."
                .phone(request.getPhone())
                .age(request.getAge())
                .role(User.Role.PATIENT) // all self-registered users are patients
                .build();

        // 3. save to database
        userRepository.save(user);

        // 4. generate JWT token
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());

        // 5. return token + user info to React
        return buildResponse(token, user);
    }

    // ── LOGIN ─────────────────────────────────────────────────────
    public AuthResponse login(LoginRequest request) {

        // 1. verify email + password (throws exception if wrong)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // 2. load user from database
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. generate JWT token
        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails, user.getRole().name());

        // 4. return token + user info to React
        return buildResponse(token, user);
    }

    // ── SHARED HELPER ─────────────────────────────────────────────
    private AuthResponse buildResponse(String token, User user) {
        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
                .user(AuthResponse.UserInfo.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .phone(user.getPhone())
                        .age(user.getAge())
                        .build())
                .build();
    }
}
