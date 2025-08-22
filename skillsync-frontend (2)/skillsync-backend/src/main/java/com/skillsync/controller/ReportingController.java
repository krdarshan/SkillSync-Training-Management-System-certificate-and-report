package com.skillsync.controller;

import com.skillsync.dto.ReportRequestDTO;
import com.skillsync.dto.ReportResponseDTO;
import com.skillsync.service.ReportingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportingController {
    
    @Autowired
    private ReportingService reportingService;
    
    @PostMapping("/generate")
    public ResponseEntity<ReportResponseDTO> generateReport(
            @RequestBody ReportRequestDTO request,
            @RequestParam String userEmail) {
        try {
            ReportResponseDTO response = reportingService.generateReport(request, userEmail);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            ReportResponseDTO errorResponse = new ReportResponseDTO();
            errorResponse.setStatus("ERROR");
            errorResponse.setMessage("Failed to generate report: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @RequestParam String userEmail) {
        try {
            Map<String, Object> stats = reportingService.getDashboardStats(userEmail);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/types")
    public ResponseEntity<Map<String, Object>> getReportTypes() {
        Map<String, Object> reportTypes = Map.of(
            "TRAINING_COMPLETION", "Training Completion Report",
            "COURSE_PARTICIPATION", "Course Participation Report", 
            "DEPARTMENT_PERFORMANCE", "Department Performance Report",
            "EMPLOYEE_PROGRESS", "Employee Progress Report"
        );
        return ResponseEntity.ok(reportTypes);
    }
    
    @GetMapping("/export-formats")
    public ResponseEntity<Map<String, Object>> getExportFormats() {
        Map<String, Object> exportFormats = Map.of(
            "PDF", "Portable Document Format",
            "EXCEL", "Microsoft Excel Spreadsheet"
        );
        return ResponseEntity.ok(exportFormats);
    }
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "Reporting Service",
            "timestamp", System.currentTimeMillis()
        ));
    }
}
