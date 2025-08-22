package com.skillsync.service;

import com.skillsync.entity.Enrollment;
import com.skillsync.entity.User;
import com.skillsync.entity.Course;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class CertificateService {
    
    public String generateCertificateId() {
        return "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    public String generateCertificateContent(Enrollment enrollment) {
        User user = enrollment.getUser();
        Course course = enrollment.getCourse();
        LocalDateTime completionDate = enrollment.getCompletedAt();
        
        StringBuilder certificate = new StringBuilder();
        certificate.append("=== SKILLSYNC CERTIFICATE OF COMPLETION ===\n\n");
        certificate.append("This is to certify that\n\n");
        certificate.append(user.getName().toUpperCase()).append("\n\n");
        certificate.append("has successfully completed the course\n\n");
        certificate.append(course.getName().toUpperCase()).append("\n\n");
        certificate.append("Category: ").append(course.getCategory()).append("\n");
        certificate.append("Duration: ").append(course.getTotalDuration()).append(" minutes\n");
        certificate.append("Completion Date: ").append(completionDate.format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"))).append("\n");
        certificate.append("Certificate ID: ").append(enrollment.getCertificateId()).append("\n\n");
        certificate.append("Trainer: ").append(course.getTrainer().getName()).append("\n");
        certificate.append("Issued on: ").append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy"))).append("\n\n");
        certificate.append("=== END CERTIFICATE ===\n");
        
        return certificate.toString();
    }
    
    public boolean validateCertificate(String certificateId, String userEmail, String courseName) {
        // Implementation for certificate validation
        // This would typically check against the database
        return certificateId != null && certificateId.startsWith("CERT-");
    }
    
    public String generateCertificatePDF(Enrollment enrollment) {
        // Implementation for PDF generation
        // This would use a library like iText or Apache PDFBox
        return generateCertificateContent(enrollment);
    }
    
    public String generateCertificateEmail(Enrollment enrollment) {
        User user = enrollment.getUser();
        Course course = enrollment.getCourse();
        
        StringBuilder email = new StringBuilder();
        email.append("Dear ").append(user.getName()).append(",\n\n");
        email.append("Congratulations! You have successfully completed the course '").append(course.getName()).append("'.\n\n");
        email.append("Your certificate has been generated and is available in your dashboard.\n");
        email.append("Certificate ID: ").append(enrollment.getCertificateId()).append("\n\n");
        email.append("Keep learning and growing with SkillSync!\n\n");
        email.append("Best regards,\nThe SkillSync Team");
        
        return email.toString();
    }
} 