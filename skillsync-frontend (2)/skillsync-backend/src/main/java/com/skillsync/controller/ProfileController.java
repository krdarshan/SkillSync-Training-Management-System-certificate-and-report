package com.skillsync.controller;

import com.skillsync.dto.UserProfileDTO;
import com.skillsync.entity.User;
import com.skillsync.service.UserService;
import com.skillsync.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "*")
public class ProfileController {
    @Autowired
    private UserService userService;
    @Autowired
    private EnrollmentService enrollmentService;

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile(Principal principal) {
        Optional<User> userOpt = userService.findByEmail(principal.getName());
        if (userOpt.isPresent()) {
            UserProfileDTO dto = userService.toProfileDTO(userOpt.get());
            return ResponseEntity.ok(dto);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping
    public ResponseEntity<UserProfileDTO> updateProfile(@RequestBody UserProfileDTO profile, Principal principal) {
        Optional<User> userOpt = userService.findByEmail(principal.getName());
        if (userOpt.isPresent()) {
            User updated = userService.updateProfile(userOpt.get(), profile);
            return ResponseEntity.ok(userService.toProfileDTO(updated));
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/profits")
    public ResponseEntity<?> getEmployeeProfits(Principal principal) {
        Optional<User> userOpt = userService.findByEmail(principal.getName());
        if (userOpt.isPresent() && userOpt.get().getRole().name().equals("EMPLOYEE")) {
            return ResponseEntity.ok(enrollmentService.getEmployeeCourseProfits(userOpt.get().getId()));
        }
        return ResponseEntity.badRequest().body("Not an employee");
    }
} 