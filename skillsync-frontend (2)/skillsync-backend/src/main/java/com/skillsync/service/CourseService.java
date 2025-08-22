package com.skillsync.service;

import com.skillsync.entity.Course;
import com.skillsync.entity.User;
import com.skillsync.repository.CourseRepository;
import com.skillsync.repository.EnrollmentRepository;
import com.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    public Optional<Course> findById(Long id) {
        return courseRepository.findById(id);
    }
    
    public List<Course> findByCategory(String category) {
        return courseRepository.findByCategoryIgnoreCase(category);
    }
    
    public List<Course> findByNameContaining(String query) {
        return courseRepository.findByNameContainingIgnoreCase(query);
    }
    
    public List<Course> findByTrainer(Long trainerId) {
        return courseRepository.findByTrainerId(trainerId);
    }
    
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }
    
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
    
    // Enhanced methods for better functionality
    
    public List<Course> getPopularCourses() {
        // Get courses with highest enrollment count
        return courseRepository.findTopCoursesByEnrollmentCount(PageRequest.of(0, 5));
    }
    
    public List<Course> getRecentCourses() {
        // Get courses created in the last 30 days
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return courseRepository.findByCreatedAtAfter(thirtyDaysAgo);
    }
    
    public List<Course> getCoursesByDuration(int minDuration, int maxDuration) {
        return courseRepository.findByTotalDurationBetween(minDuration, maxDuration);
    }
    
    public List<Course> searchCourses(String query) {
        // Search by name, description, or category
        return courseRepository.searchCourses(query);
    }
    
    public List<Course> getAvailableCoursesForUser(Long userId) {
        // Get courses that user hasn't enrolled in yet
        return courseRepository.findAvailableCoursesForUser(userId);
    }
    
    public List<Course> getRecommendedCourses(Long userId) {
        // Get courses based on user's previous enrollments and preferences
        return courseRepository.findRecommendedCoursesForUser(userId);
    }
    
    public Course createCourseWithTrainer(Course course, Long trainerId) {
        Optional<User> trainer = userRepository.findById(trainerId);
        if (trainer.isPresent() && trainer.get().getRole().name().equals("TRAINER")) {
            course.setTrainer(trainer.get());
            return courseRepository.save(course);
        }
        throw new RuntimeException("Invalid trainer ID or user is not a trainer");
    }
    
    public List<String> getAllCategories() {
        return courseRepository.findAllCategories();
    }
    
    public List<Course> getCoursesByMultipleCategories(List<String> categories) {
        return courseRepository.findByCategoryIn(categories);
    }
    
    public long getTotalCourses() {
        return courseRepository.count();
    }
    
    public long getCoursesByCategory(String category) {
        return courseRepository.countByCategory(category);
    }
    
    public double getAverageCourseDuration() {
        return courseRepository.findAverageDuration();
    }
    
    public List<Course> getCoursesWithEnrollmentCount() {
        // Get courses with their enrollment counts
        return courseRepository.findCoursesWithEnrollmentCount();
    }
} 