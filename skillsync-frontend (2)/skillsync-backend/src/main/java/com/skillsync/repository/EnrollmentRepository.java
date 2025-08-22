package com.skillsync.repository;

import com.skillsync.entity.Enrollment;
import com.skillsync.entity.EnrollmentStatus;
import com.skillsync.entity.User;
import com.skillsync.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    
    List<Enrollment> findByUser(User user);
    
    List<Enrollment> findByUserAndStatus(User user, EnrollmentStatus status);
    
    Optional<Enrollment> findByUserAndCourse(User user, Course course);
    
    List<Enrollment> findByCourse(Course course);
    
    List<Enrollment> findByStatus(EnrollmentStatus status);
    
    long countByUserAndStatus(User user, EnrollmentStatus status);

    List<Enrollment> findByUserId(Long userId);
    
    List<Enrollment> findByCourseId(Long courseId);
} 