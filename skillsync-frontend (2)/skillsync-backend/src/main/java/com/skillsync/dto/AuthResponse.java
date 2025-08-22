package com.skillsync.dto;

public class AuthResponse {
    
    private String token;
    private String message;
    private String role;
    private String name;
    private String email;
    private boolean success;
    
    // Constructors
    public AuthResponse() {}
    
    public AuthResponse(String token, String message, String role, String name, String email, boolean success) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.name = name;
        this.email = email;
        this.success = success;
    }
    
    // Static factory methods
    public static AuthResponse success(String token, String role, String name, String email) {
        return new AuthResponse(token, "Login successful", role, name, email, true);
    }
    
    public static AuthResponse error(String message) {
        return new AuthResponse(null, message, null, null, null, false);
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
} 