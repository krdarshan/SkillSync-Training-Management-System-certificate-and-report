package com.skillsync.controller;

import com.skillsync.entity.Course;
import com.skillsync.entity.Enrollment;
import com.skillsync.entity.EnrollmentStatus;
import com.skillsync.entity.User;
import com.skillsync.service.CourseService;
import com.skillsync.service.EnrollmentService;
import com.skillsync.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private CourseService courseService;
    
    @PostMapping("/enroll/{courseId}")
    public ResponseEntity<Map<String, Object>> enrollInCourse(@PathVariable Long courseId, @RequestParam String userEmail) {
        try {
            Optional<User> userOpt = userService.findByEmail(userEmail);
            Optional<Course> courseOpt = courseService.findById(courseId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
            }
            
            if (courseOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Course not found"));
            }
            
            Enrollment enrollment = enrollmentService.enrollUserInCourse(userOpt.get(), courseOpt.get());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully enrolled in course");
            response.put("enrollment", enrollment);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<Enrollment>> getUserEnrollments(Principal principal) {
        Optional<User> userOpt = userService.findByEmail(principal.getName());
        if (userOpt.isPresent()) {
            List<Enrollment> enrollments = enrollmentService.getUserEnrollments(userOpt.get().getId());
            return ResponseEntity.ok(enrollments);
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/user/{userEmail}")
    public ResponseEntity<List<Enrollment>> getUserEnrollments(@PathVariable String userEmail) {
        Optional<User> userOpt = userService.findByEmail(userEmail);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        List<Enrollment> enrollments = enrollmentService.getUserEnrollments(userOpt.get().getId());
        return ResponseEntity.ok(enrollments);
    }
    
    @GetMapping("/user/{userEmail}/status/{status}")
    public ResponseEntity<List<Enrollment>> getUserEnrollmentsByStatus(@PathVariable String userEmail, @PathVariable String status) {
        Optional<User> userOpt = userService.findByEmail(userEmail);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        try {
            EnrollmentStatus enrollmentStatus = EnrollmentStatus.valueOf(status.toUpperCase());
            List<Enrollment> enrollments = enrollmentService.getUserEnrollmentsByStatus(userOpt.get(), enrollmentStatus);
            return ResponseEntity.ok(enrollments);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{enrollmentId}/progress")
    public ResponseEntity<Enrollment> updateProgress(@PathVariable Long enrollmentId, @RequestParam Integer progressPercentage) {
        try {
            Enrollment enrollment = enrollmentService.updateProgress(enrollmentId, progressPercentage);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{enrollmentId}/complete")
    public ResponseEntity<Enrollment> completeCourse(@PathVariable Long enrollmentId) {
        try {
            Enrollment enrollment = enrollmentService.completeCourse(enrollmentId);
            return ResponseEntity.ok(enrollment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/user/{userEmail}/stats")
    public ResponseEntity<Map<String, Object>> getUserStats(@PathVariable String userEmail) {
        Optional<User> userOpt = userService.findByEmail(userEmail);
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        User user = userOpt.get();
        Map<String, Object> stats = new HashMap<>();
        stats.put("completedCourses", enrollmentService.getCompletedCoursesCount(user));
        stats.put("inProgressCourses", enrollmentService.getInProgressCoursesCount(user));
        stats.put("enrolledCourses", enrollmentService.getEnrolledCoursesCount(user));
        
        return ResponseEntity.ok(stats);
    }
} 