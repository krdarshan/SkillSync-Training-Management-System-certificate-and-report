package com.skillsync.controller;

import com.skillsync.entity.Course;
import com.skillsync.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {
    
    @Autowired
    private CourseService courseService;
    
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        List<Course> courses = courseService.getAllCourses();
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.findById(id);
        return course.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable String category) {
        List<Course> courses = courseService.findByCategory(category);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String query) {
        List<Course> courses = courseService.findByNameContaining(query);
        return ResponseEntity.ok(courses);
    }
    
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<Course>> getCoursesByTrainer(@PathVariable Long trainerId) {
        List<Course> courses = courseService.findByTrainer(trainerId);
        return ResponseEntity.ok(courses);
    }
    
    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course savedCourse = courseService.saveCourse(course);
        return ResponseEntity.ok(savedCourse);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course course) {
        Optional<Course> existingCourse = courseService.findById(id);
        if (existingCourse.isPresent()) {
            course.setId(id);
            Course updatedCourse = courseService.saveCourse(course);
            return ResponseEntity.ok(updatedCourse);
        }
        return ResponseEntity.notFound().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        Optional<Course> course = courseService.findById(id);
        if (course.isPresent()) {
            courseService.deleteCourse(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<Course>> getPopularCourses() {
        // Implementation for popular courses based on enrollment count
        List<Course> popularCourses = courseService.getPopularCourses();
        return ResponseEntity.ok(popularCourses);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<Course>> getRecentCourses() {
        // Implementation for recently added courses
        List<Course> recentCourses = courseService.getRecentCourses();
        return ResponseEntity.ok(recentCourses);
    }
} 