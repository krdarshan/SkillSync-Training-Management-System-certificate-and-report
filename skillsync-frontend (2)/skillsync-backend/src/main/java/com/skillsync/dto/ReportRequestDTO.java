package com.skillsync.dto;

import java.time.LocalDate;
import java.util.List;

public class ReportRequestDTO {
    private String reportType; // TRAINING_COMPLETION, COURSE_PARTICIPATION, DEPARTMENT_PERFORMANCE, EMPLOYEE_PROGRESS
    private String exportFormat; // PDF, EXCEL
    private List<String> courseNames;
    private List<Long> employeeIds;
    private List<String> departments;
    private LocalDate startDate;
    private LocalDate endDate;
    private String searchQuery;
    private String sortBy;
    private String sortOrder; // ASC, DESC
    private boolean includeIncomplete;
    private boolean includeCertificates;

    // Constructors
    public ReportRequestDTO() {}

    public ReportRequestDTO(String reportType, String exportFormat) {
        this.reportType = reportType;
        this.exportFormat = exportFormat;
    }

    // Getters and Setters
    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getExportFormat() {
        return exportFormat;
    }

    public void setExportFormat(String exportFormat) {
        this.exportFormat = exportFormat;
    }

    public List<String> getCourseNames() {
        return courseNames;
    }

    public void setCourseNames(List<String> courseNames) {
        this.courseNames = courseNames;
    }

    public List<Long> getEmployeeIds() {
        return employeeIds;
    }

    public void setEmployeeIds(List<Long> employeeIds) {
        this.employeeIds = employeeIds;
    }

    public List<String> getDepartments() {
        return departments;
    }

    public void setDepartments(List<String> departments) {
        this.departments = departments;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getSearchQuery() {
        return searchQuery;
    }

    public void setSearchQuery(String searchQuery) {
        this.searchQuery = searchQuery;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public boolean isIncludeIncomplete() {
        return includeIncomplete;
    }

    public void setIncludeIncomplete(boolean includeIncomplete) {
        this.includeIncomplete = includeIncomplete;
    }

    public boolean isIncludeCertificates() {
        return includeCertificates;
    }

    public void setIncludeCertificates(boolean includeCertificates) {
        this.includeCertificates = includeCertificates;
    }
}
