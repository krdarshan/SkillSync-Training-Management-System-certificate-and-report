package com.skillsync.controller;

import com.skillsync.dto.AuthResponse;
import com.skillsync.dto.LoginRequest;
import com.skillsync.dto.RegisterRequest;
import com.skillsync.entity.User;
import com.skillsync.security.JwtUtil;
import com.skillsync.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerEmployee(@Valid @RequestBody RegisterRequest request) {
        try {
            User user = userService.registerEmployee(request);
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
            
            return ResponseEntity.ok(AuthResponse.success(token, user.getRole().name(), user.getName(), user.getEmail()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            Optional<User> userOpt = userService.authenticateUser(request.getEmail(), request.getPassword(), request.getRole());
            
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
                
                return ResponseEntity.ok(AuthResponse.success(token, user.getRole().name(), user.getName(), user.getEmail()));
            } else {
                return ResponseEntity.badRequest().body(AuthResponse.error("Invalid credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(AuthResponse.error(e.getMessage()));
        }
    }
    
    @GetMapping("/auth/validate")
    public ResponseEntity<AuthResponse> validateToken(@RequestHeader("Authorization") String token) {
        try {
            if (token != null && token.startsWith("Bearer ")) {
                String jwtToken = token.substring(7);
                String email = jwtUtil.extractUsername(jwtToken);
                
                Optional<User> userOpt = userService.findByEmail(email);
                if (userOpt.isPresent() && jwtUtil.validateToken(jwtToken, email)) {
                    User user = userOpt.get();
                    return ResponseEntity.ok(AuthResponse.success(jwtToken, user.getRole().name(), user.getName(), user.getEmail()));
                }
            }
            
            return ResponseEntity.badRequest().body(AuthResponse.error("Invalid token"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(AuthResponse.error("Token validation failed"));
        }
    }
} 