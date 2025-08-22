package com.skillsync.service;

import com.skillsync.dto.ReportRequestDTO;
import com.skillsync.dto.ReportResponseDTO;
import com.skillsync.entity.Course;
import com.skillsync.entity.Enrollment;
import com.skillsync.entity.User;
import com.skillsync.repository.CourseRepository;
import com.skillsync.repository.EnrollmentRepository;
import com.skillsync.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportingService {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public ReportResponseDTO generateReport(ReportRequestDTO request, String userEmail) {
        ReportResponseDTO response = new ReportResponseDTO(
            generateReportId(),
            request.getReportType(),
            generateReportName(request)
        );
        
        response.setGeneratedBy(userEmail);
        response.setExportFormat(request.getExportFormat());
        response.setStatus("SUCCESS");
        
        try {
            switch (request.getReportType()) {
                case "TRAINING_COMPLETION":
                    response.setData(generateTrainingCompletionReport(request));
                    break;
                case "COURSE_PARTICIPATION":
                    response.setData(generateCourseParticipationReport(request));
                    break;
                case "DEPARTMENT_PERFORMANCE":
                    response.setData(generateDepartmentPerformanceReport(request));
                    break;
                case "EMPLOYEE_PROGRESS":
                    response.setData(generateEmployeeProgressReport(request));
                    break;
                default:
                    response.setStatus("ERROR");
                    response.setMessage("Invalid report type");
                    return response;
            }
            
            response.setTotalRecords(response.getData().size());
            response.setSummary(generateReportSummary(response.getData(), request.getReportType()));
            
        } catch (Exception e) {
            response.setStatus("ERROR");
            response.setMessage("Error generating report: " + e.getMessage());
        }
        
        return response;
    }
    
    private List<Map<String, Object>> generateTrainingCompletionReport(ReportRequestDTO request) {
        List<Enrollment> enrollments = enrollmentRepository.findAll();
        
        return enrollments.stream()
            .filter(e -> applyFilters(e, request))
            .map(e -> {
                Map<String, Object> row = new HashMap<>();
                row.put("employeeId", e.getUser().getId());
                row.put("employeeName", e.getUser().getName());
                row.put("employeeEmail", e.getUser().getEmail());
                row.put("department", e.getUser().getDepartment());
                row.put("courseId", e.getCourse().getId());
                row.put("courseName", e.getCourse().getName());
                row.put("courseCategory", e.getCourse().getCategory());
                row.put("status", e.getStatus().name());
                row.put("progressPercentage", e.getProgressPercentage());
                row.put("enrolledAt", e.getEnrolledAt());
                row.put("completedAt", e.getCompletedAt());
                row.put("certificateId", e.getCertificateId());
                return row;
            })
            .collect(Collectors.toList());
    }
    
    private List<Map<String, Object>> generateCourseParticipationReport(ReportRequestDTO request) {
        List<Course> courses = courseRepository.findAll();
        
        return courses.stream()
            .map(course -> {
                Map<String, Object> row = new HashMap<>();
                row.put("courseId", course.getId());
                row.put("courseName", course.getName());
                row.put("courseCategory", course.getCategory());
                row.put("trainerName", course.getTrainer() != null ? course.getTrainer().getName() : "N/A");
                row.put("totalDuration", course.getTotalDuration());
                row.put("createdAt", course.getCreatedAt());
                
                // Get enrollment statistics
                List<Enrollment> courseEnrollments = enrollmentRepository.findByCourseId(course.getId());
                row.put("totalEnrollments", courseEnrollments.size());
                row.put("completedEnrollments", courseEnrollments.stream()
                    .filter(e -> e.getStatus().name().equals("COMPLETED"))
                    .count());
                row.put("inProgressEnrollments", courseEnrollments.stream()
                    .filter(e -> e.getStatus().name().equals("IN_PROGRESS"))
                    .count());
                row.put("averageProgress", courseEnrollments.stream()
                    .mapToInt(e -> e.getProgressPercentage() != null ? e.getProgressPercentage() : 0)
                    .average()
                    .orElse(0.0));
                
                return row;
            })
            .collect(Collectors.toList());
    }
    
    private List<Map<String, Object>> generateDepartmentPerformanceReport(ReportRequestDTO request) {
        List<User> users = userRepository.findAll();
        
        return users.stream()
            .filter(user -> user.getDepartment() != null && !user.getDepartment().isEmpty())
            .collect(Collectors.groupingBy(User::getDepartment))
            .entrySet().stream()
            .map(entry -> {
                String department = entry.getKey();
                List<User> departmentUsers = entry.getValue();
                
                Map<String, Object> row = new HashMap<>();
                row.put("department", department);
                row.put("totalEmployees", departmentUsers.size());
                
                // Get department enrollment statistics
                List<Enrollment> departmentEnrollments = new ArrayList<>();
                for (User user : departmentUsers) {
                    departmentEnrollments.addAll(enrollmentRepository.findByUserId(user.getId()));
                }
                
                row.put("totalEnrollments", departmentEnrollments.size());
                row.put("completedEnrollments", departmentEnrollments.stream()
                    .filter(e -> e.getStatus().name().equals("COMPLETED"))
                    .count());
                row.put("averageProgress", departmentEnrollments.stream()
                    .mapToInt(e -> e.getProgressPercentage() != null ? e.getProgressPercentage() : 0)
                    .average()
                    .orElse(0.0));
                row.put("certificatesIssued", departmentEnrollments.stream()
                    .filter(e -> e.getCertificateId() != null && !e.getCertificateId().isEmpty())
                    .count());
                
                return row;
            })
            .collect(Collectors.toList());
    }
    
    private List<Map<String, Object>> generateEmployeeProgressReport(ReportRequestDTO request) {
        List<User> employees = userRepository.findAll().stream()
            .filter(user -> user.getRole().name().equals("EMPLOYEE"))
            .collect(Collectors.toList());
        
        return employees.stream()
            .map(employee -> {
                Map<String, Object> row = new HashMap<>();
                row.put("employeeId", employee.getId());
                row.put("employeeName", employee.getName());
                row.put("employeeEmail", employee.getEmail());
                row.put("department", employee.getDepartment());
                row.put("position", employee.getPosition());
                
                List<Enrollment> employeeEnrollments = enrollmentRepository.findByUserId(employee.getId());
                row.put("totalEnrollments", employeeEnrollments.size());
                row.put("completedCourses", employeeEnrollments.stream()
                    .filter(e -> e.getStatus().name().equals("COMPLETED"))
                    .count());
                row.put("inProgressCourses", employeeEnrollments.stream()
                    .filter(e -> e.getStatus().name().equals("IN_PROGRESS"))
                    .count());
                row.put("averageProgress", employeeEnrollments.stream()
                    .mapToInt(e -> e.getProgressPercentage() != null ? e.getProgressPercentage() : 0)
                    .average()
                    .orElse(0.0));
                row.put("certificatesEarned", employeeEnrollments.stream()
                    .filter(e -> e.getCertificateId() != null && !e.getCertificateId().isEmpty())
                    .count());
                
                return row;
            })
            .collect(Collectors.toList());
    }
    
    private boolean applyFilters(Enrollment enrollment, ReportRequestDTO request) {
        // Course name filter
        if (request.getCourseNames() != null && !request.getCourseNames().isEmpty()) {
            if (!request.getCourseNames().contains(enrollment.getCourse().getName())) {
                return false;
            }
        }
        
        // Employee ID filter
        if (request.getEmployeeIds() != null && !request.getEmployeeIds().isEmpty()) {
            if (!request.getEmployeeIds().contains(enrollment.getUser().getId())) {
                return false;
            }
        }
        
        // Department filter
        if (request.getDepartments() != null && !request.getDepartments().isEmpty()) {
            if (enrollment.getUser().getDepartment() == null || 
                !request.getDepartments().contains(enrollment.getUser().getDepartment())) {
                return false;
            }
        }
        
        // Date range filter
        if (request.getStartDate() != null && enrollment.getEnrolledAt() != null) {
            if (enrollment.getEnrolledAt().toLocalDate().isBefore(request.getStartDate())) {
                return false;
            }
        }
        
        if (request.getEndDate() != null && enrollment.getEnrolledAt() != null) {
            if (enrollment.getEnrolledAt().toLocalDate().isAfter(request.getEndDate())) {
                return false;
            }
        }
        
        // Include incomplete filter
        if (!request.isIncludeIncomplete() && enrollment.getStatus().name().equals("IN_PROGRESS")) {
            return false;
        }
        
        return true;
    }
    
    private Map<String, Object> generateReportSummary(List<Map<String, Object>> data, String reportType) {
        Map<String, Object> summary = new HashMap<>();
        
        switch (reportType) {
            case "TRAINING_COMPLETION":
                summary.put("totalEnrollments", data.size());
                summary.put("completedCourses", data.stream()
                    .filter(row -> "COMPLETED".equals(row.get("status")))
                    .count());
                summary.put("inProgressCourses", data.stream()
                    .filter(row -> "IN_PROGRESS".equals(row.get("status")))
                    .count());
                summary.put("averageProgress", data.stream()
                    .mapToDouble(row -> (Integer) row.get("progressPercentage"))
                    .average()
                    .orElse(0.0));
                break;
                
            case "COURSE_PARTICIPATION":
                summary.put("totalCourses", data.size());
                summary.put("totalEnrollments", data.stream()
                    .mapToInt(row -> (Integer) row.get("totalEnrollments"))
                    .sum());
                summary.put("averageCompletionRate", data.stream()
                    .mapToDouble(row -> {
                        int total = (Integer) row.get("totalEnrollments");
                        long completed = (Long) row.get("completedEnrollments");
                        return total > 0 ? (double) completed / total * 100 : 0.0;
                    })
                    .average()
                    .orElse(0.0));
                break;
                
            case "DEPARTMENT_PERFORMANCE":
                summary.put("totalDepartments", data.size());
                summary.put("totalEmployees", data.stream()
                    .mapToInt(row -> (Integer) row.get("totalEmployees"))
                    .sum());
                summary.put("overallCompletionRate", data.stream()
                    .mapToDouble(row -> {
                        int total = (Integer) row.get("totalEnrollments");
                        long completed = (Long) row.get("completedEnrollments");
                        return total > 0 ? (double) completed / total * 100 : 0.0;
                    })
                    .average()
                    .orElse(0.0));
                break;
                
            case "EMPLOYEE_PROGRESS":
                summary.put("totalEmployees", data.size());
                summary.put("totalEnrollments", data.stream()
                    .mapToInt(row -> (Integer) row.get("totalEnrollments"))
                    .sum());
                summary.put("averageEmployeeProgress", data.stream()
                    .mapToDouble(row -> (Double) row.get("averageProgress"))
                    .average()
                    .orElse(0.0));
                break;
        }
        
        return summary;
    }
    
    private String generateReportId() {
        return "REP_" + System.currentTimeMillis() + "_" + new Random().nextInt(1000);
    }
    
    private String generateReportName(ReportRequestDTO request) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm");
        String timestamp = LocalDateTime.now().format(formatter);
        return request.getReportType() + "_Report_" + timestamp;
    }
    
    public Map<String, Object> getDashboardStats(String userEmail) {
        Map<String, Object> stats = new HashMap<>();
        
        User user = userRepository.findByEmail(userEmail).orElse(null);
        if (user == null) {
            return stats;
        }
        
        List<Enrollment> enrollments;
        
        if (user.getRole().name().equals("MANAGER")) {
            // Manager sees department-wide stats
            List<User> departmentUsers = userRepository.findByDepartment(user.getDepartment());
            enrollments = new ArrayList<>();
            for (User deptUser : departmentUsers) {
                enrollments.addAll(enrollmentRepository.findByUserId(deptUser.getId()));
            }
        } else if (user.getRole().name().equals("TRAINER")) {
            // Trainer sees course-specific stats
            List<Course> trainerCourses = courseRepository.findByTrainerId(user.getId());
            enrollments = new ArrayList<>();
            for (Course course : trainerCourses) {
                enrollments.addAll(enrollmentRepository.findByCourseId(course.getId()));
            }
        } else {
            // Employee sees personal stats
            enrollments = enrollmentRepository.findByUserId(user.getId());
        }
        
        stats.put("totalEnrollments", enrollments.size());
        stats.put("completedCourses", enrollments.stream()
            .filter(e -> e.getStatus().name().equals("COMPLETED"))
            .count());
        stats.put("inProgressCourses", enrollments.stream()
            .filter(e -> e.getStatus().name().equals("IN_PROGRESS"))
            .count());
        stats.put("certificatesIssued", enrollments.stream()
            .filter(e -> e.getCertificateId() != null && !e.getCertificateId().isEmpty())
            .count());
        stats.put("averageProgress", enrollments.stream()
            .mapToInt(e -> e.getProgressPercentage() != null ? e.getProgressPercentage() : 0)
            .average()
            .orElse(0.0));
        
        return stats;
    }
}
