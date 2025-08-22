package com.skillsync.service;

import com.skillsync.dto.RegisterRequest;
import com.skillsync.dto.UserProfileDTO;
import com.skillsync.entity.User;
import com.skillsync.entity.UserRole;
import com.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    public User registerEmployee(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        // Create new employee user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(UserRole.EMPLOYEE);
        
        return userRepository.save(user);
    }
    
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public Optional<User> authenticateUser(String email, String password, String role) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Check if password matches and role is correct
            if (passwordEncoder.matches(password, user.getPassword()) && 
                user.getRole().name().equalsIgnoreCase(role)) {
                return Optional.of(user);
            }
        }
        
        return Optional.empty();
    }
    
    public List<User> getAllEmployees() {
        return userRepository.findByRole(UserRole.EMPLOYEE);
    }
    
    public List<User> getAllTrainers() {
        return userRepository.findByRole(UserRole.TRAINER);
    }
    
    public List<User> getAllManagers() {
        return userRepository.findByRole(UserRole.MANAGER);
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public UserProfileDTO toProfileDTO(User user) {
        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setPhone(user.getPhone());
        dto.setAddress(user.getAddress());
        dto.setDepartment(user.getDepartment());
        dto.setPosition(user.getPosition());
        dto.setProfileImageUrl(user.getProfileImageUrl());
        dto.setBio(user.getBio());
        return dto;
    }

    public User updateProfile(User user, UserProfileDTO profile) {
        user.setName(profile.getName());
        user.setPhone(profile.getPhone());
        user.setAddress(profile.getAddress());
        user.setDepartment(profile.getDepartment());
        user.setPosition(profile.getPosition());
        user.setProfileImageUrl(profile.getProfileImageUrl());
        user.setBio(profile.getBio());
        return userRepository.save(user);
    }
} 