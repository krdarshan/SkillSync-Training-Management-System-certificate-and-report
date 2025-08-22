package com.skillsync.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
public class Enrollment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is required")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @NotNull(message = "Course is required")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Course course;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EnrollmentStatus status;
    
    @Column(name = "progress_percentage")
    private Integer progressPercentage = 0;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    @Column(name = "certificate_id")
    private String certificateId;
    
    @Column(name = "enrolled_at")
    private LocalDateTime enrolledAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (status == null) {
            status = EnrollmentStatus.IN_PROGRESS;
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (progressPercentage != null && progressPercentage >= 100 && status != EnrollmentStatus.COMPLETED) {
            status = EnrollmentStatus.COMPLETED;
            completedAt = LocalDateTime.now();
        }
    }
    
    // Constructors
    public Enrollment() {}
    
    public Enrollment(User user, Course course) {
        this.user = user;
        this.course = course;
        this.status = EnrollmentStatus.IN_PROGRESS;
        this.progressPercentage = 0;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Course getCourse() {
        return course;
    }
    
    public void setCourse(Course course) {
        this.course = course;
    }
    
    public EnrollmentStatus getStatus() {
        return status;
    }
    
    public void setStatus(EnrollmentStatus status) {
        this.status = status;
    }
    
    public Integer getProgressPercentage() {
        return progressPercentage;
    }
    
    public void setProgressPercentage(Integer progressPercentage) {
        this.progressPercentage = progressPercentage;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
    
    public String getCertificateId() {
        return certificateId;
    }
    
    public void setCertificateId(String certificateId) {
        this.certificateId = certificateId;
    }
    
    public LocalDateTime getEnrolledAt() {
        return enrolledAt;
    }
    
    public void setEnrolledAt(LocalDateTime enrolledAt) {
        this.enrolledAt = enrolledAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 