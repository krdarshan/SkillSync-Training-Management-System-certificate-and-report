package com.skillsync.service;

import com.skillsync.entity.Course;
import com.skillsync.entity.Enrollment;
import com.skillsync.entity.EnrollmentStatus;
import com.skillsync.entity.User;
import com.skillsync.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.util.UUID;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    public Enrollment enrollUserInCourse(User user, Course course) {
        // Check if user is already enrolled in this course
        Optional<Enrollment> existingEnrollment = enrollmentRepository.findByUserAndCourse(user, course);
        
        if (existingEnrollment.isPresent()) {
            throw new RuntimeException("User is already enrolled in this course");
        }
        
        // Create new enrollment
        Enrollment enrollment = new Enrollment(user, course);
        enrollment.setStatus(EnrollmentStatus.ENROLLED);
        enrollment.setProgressPercentage(0);
        
        return enrollmentRepository.save(enrollment);
    }
    
    public List<Enrollment> getUserEnrollments(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }
    
    public List<Enrollment> getUserEnrollmentsByStatus(User user, EnrollmentStatus status) {
        return enrollmentRepository.findByUserAndStatus(user, status);
    }
    
    public Optional<Enrollment> getUserEnrollmentForCourse(User user, Course course) {
        return enrollmentRepository.findByUserAndCourse(user, course);
    }
    
    public Enrollment updateProgress(Long enrollmentId, Integer progressPercentage) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
        
        if (enrollmentOpt.isPresent()) {
            Enrollment enrollment = enrollmentOpt.get();
            enrollment.setProgressPercentage(progressPercentage);
            
            // Update status based on progress
            if (progressPercentage >= 100) {
                enrollment.setStatus(EnrollmentStatus.COMPLETED);
                enrollment.setCompletedAt(LocalDateTime.now());
                enrollment.setCertificateId(generateCertificateId(enrollment.getCourse().getName()));
            } else if (progressPercentage > 0) {
                enrollment.setStatus(EnrollmentStatus.IN_PROGRESS);
            }
            
            return enrollmentRepository.save(enrollment);
        }
        
        throw new RuntimeException("Enrollment not found");
    }
    
    public Enrollment completeCourse(Long enrollmentId) {
        Optional<Enrollment> enrollmentOpt = enrollmentRepository.findById(enrollmentId);
        
        if (enrollmentOpt.isPresent()) {
            Enrollment enrollment = enrollmentOpt.get();
            enrollment.setProgressPercentage(100);
            enrollment.setStatus(EnrollmentStatus.COMPLETED);
            enrollment.setCompletedAt(LocalDateTime.now());
            enrollment.setCertificateId(generateCertificateId(enrollment.getCourse().getName()));
            
            return enrollmentRepository.save(enrollment);
        }
        
        throw new RuntimeException("Enrollment not found");
    }
    
    public List<Enrollment> getCourseEnrollments(Course course) {
        return enrollmentRepository.findByCourse(course);
    }
    
    public long getCompletedCoursesCount(User user) {
        return enrollmentRepository.countByUserAndStatus(user, EnrollmentStatus.COMPLETED);
    }
    
    public long getInProgressCoursesCount(User user) {
        return enrollmentRepository.countByUserAndStatus(user, EnrollmentStatus.IN_PROGRESS);
    }
    
    public long getEnrolledCoursesCount(User user) {
        return enrollmentRepository.countByUserAndStatus(user, EnrollmentStatus.ENROLLED);
    }
    
    public Map<String, Object> getEmployeeCourseProfits(Long userId) {
        Map<String, Object> stats = new HashMap<>();
        List<Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        int totalCourses = enrollments.size();
        int completed = (int) enrollments.stream().filter(e -> e.getStatus() == EnrollmentStatus.COMPLETED).count();
        int certificates = (int) enrollments.stream().filter(e -> e.getCertificateId() != null).count();
        int totalMinutes = enrollments.stream().filter(e -> e.getStatus() == EnrollmentStatus.COMPLETED && e.getCourse() != null && e.getCourse().getTotalDuration() != null).mapToInt(e -> e.getCourse().getTotalDuration()).sum();
        stats.put("totalCourses", totalCourses);
        stats.put("completedCourses", completed);
        stats.put("certificates", certificates);
        stats.put("totalHours", totalMinutes / 60.0);
        return stats;
    }
    
    private String generateCertificateId(String courseName) {
        return "CERT-" + courseName.replaceAll("[^A-Za-z0-9]", "").toUpperCase() + 
               "-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
} 