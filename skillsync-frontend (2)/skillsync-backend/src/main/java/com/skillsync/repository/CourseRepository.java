package com.skillsync.repository;

import com.skillsync.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    // Basic queries
    List<Course> findByCategory(String category);
    List<Course> findByCategoryIgnoreCase(String category);
    List<Course> findByNameContainingIgnoreCase(String name);
    List<Course> findByTrainerId(Long trainerId);
    
    // Enhanced queries
    List<Course> findByCreatedAtAfter(LocalDateTime date);
    List<Course> findByTotalDurationBetween(int minDuration, int maxDuration);
    List<Course> findByCategoryIn(List<String> categories);
    
    // Count queries
    long countByCategory(String category);
    
    // Search functionality
    @Query("SELECT c FROM Course c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Course> searchCourses(@Param("query") String query);
    
    // Popular courses based on enrollment count
    @Query("SELECT c FROM Course c LEFT JOIN c.enrollments e GROUP BY c ORDER BY COUNT(e) DESC")
    List<Course> findTopCoursesByEnrollmentCount(org.springframework.data.domain.Pageable pageable);
    
    // Available courses for user (not enrolled)
    @Query("SELECT c FROM Course c WHERE c.id NOT IN " +
           "(SELECT e.course.id FROM Enrollment e WHERE e.user.id = :userId)")
    List<Course> findAvailableCoursesForUser(@Param("userId") Long userId);
    
    // Recommended courses based on user's category preferences
    @Query("SELECT c FROM Course c WHERE c.category IN " +
           "(SELECT DISTINCT e.course.category FROM Enrollment e WHERE e.user.id = :userId) " +
           "AND c.id NOT IN (SELECT e.course.id FROM Enrollment e WHERE e.user.id = :userId)")
    List<Course> findRecommendedCoursesForUser(@Param("userId") Long userId);
    
    // Courses ordered by enrollment count (returns Course entities)
    @Query("SELECT c FROM Course c LEFT JOIN c.enrollments e GROUP BY c ORDER BY COUNT(e) DESC")
    List<Course> findCoursesWithEnrollmentCount();
    
    // Get all categories
    @Query("SELECT DISTINCT c.category FROM Course c")
    List<String> findAllCategories();
    
    // Average course duration
    @Query("SELECT AVG(c.totalDuration) FROM Course c")
    Double findAverageDuration();
    
    // Courses by trainer ordered by enrollment count
    @Query("SELECT c FROM Course c LEFT JOIN c.enrollments e WHERE c.trainer.id = :trainerId GROUP BY c ORDER BY COUNT(e) DESC")
    List<Course> findCoursesByTrainerWithEnrollmentCount(@Param("trainerId") Long trainerId);
    
    // Recent popular courses
    @Query("SELECT c FROM Course c WHERE c.createdAt >= :date " +
           "ORDER BY (SELECT COUNT(e) FROM Enrollment e WHERE e.course = c) DESC")
    List<Course> findRecentPopularCourses(@Param("date") LocalDateTime date);
    
    // Courses with completion rate
    @Query("SELECT c, " +
           "COUNT(e) as totalEnrollments, " +
           "COUNT(CASE WHEN e.status = 'COMPLETED' THEN 1 END) as completedEnrollments " +
           "FROM Course c LEFT JOIN c.enrollments e " +
           "GROUP BY c")
    List<Object[]> findCoursesWithCompletionRate();
} 