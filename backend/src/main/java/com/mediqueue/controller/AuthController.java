package com.mediqueue.controller;

import com.mediqueue.dto.AuthResponse;
import com.mediqueue.dto.LoginRequest;
import com.mediqueue.dto.RegisterRequest;
import com.mediqueue.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController           // this class handles HTTP requests and returns JSON
@RequestMapping("/api/auth")  // all routes here start with /api/auth
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // POST /api/auth/register
    // React sends: {"name":"Rahul","email":"r@test.com","password":"123456"}
    // We return: {"token":"eyJ...","role":"PATIENT","user":{...}}
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    // POST /api/auth/login
    // React sends: {"email":"r@test.com","password":"123456"}
    // We return: {"token":"eyJ...","role":"PATIENT","user":{...}}
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // GET /api/auth/me
    // Used to verify token is still valid
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        return ResponseEntity.ok(Map.of("message", "Token is valid"));
    }

    // handles errors thrown by AuthService
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleError(RuntimeException ex) {
        return ResponseEntity
                .badRequest()
                .body(Map.of("message", ex.getMessage()));
    }
}
