package com.edusentinel.dto;

import java.time.LocalDateTime;

public class ComplaintResponse {

    private boolean success;
    private String message;

    private String complaintId;
    private String status;
    private String priority;
    private Integer riskScore;

    private String incidentType;
    private String examName;

    private LocalDateTime submittedAt;

    public ComplaintResponse() {
    }

    public ComplaintResponse(
            boolean success,
            String message,
            String complaintId,
            String status,
            String priority,
            Integer riskScore,
            String incidentType,
            String examName,
            LocalDateTime submittedAt) {

        this.success = success;
        this.message = message;
        this.complaintId = complaintId;
        this.status = status;
        this.priority = priority;
        this.riskScore = riskScore;
        this.incidentType = incidentType;
        this.examName = examName;
        this.submittedAt = submittedAt;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getComplaintId() {
        return complaintId;
    }

    public void setComplaintId(String complaintId) {
        this.complaintId = complaintId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getIncidentType() {
        return incidentType;
    }

    public void setIncidentType(String incidentType) {
        this.incidentType = incidentType;
    }

    public String getExamName() {
        return examName;
    }

    public void setExamName(String examName) {
        this.examName = examName;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}