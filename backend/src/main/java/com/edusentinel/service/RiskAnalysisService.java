package com.edusentinel.service;

import com.edusentinel.entity.Complaint;
import org.springframework.stereotype.Service;

@Service
public class RiskAnalysisService {

    public int calculateRiskScore(Complaint complaint) {

        int score = 20;

        if (complaint == null) {
            return score;
        }

        String incidentType =
                complaint.getIncidentType();

        if (incidentType != null) {

            String type =
                    incidentType.toLowerCase();

            if (type.contains("paper leak")) {
                score += 40;
            }

            if (type.contains("paper shared")) {
                score += 30;
            }

            if (type.contains("unauthorized")) {
                score += 25;
            }

            if (type.contains("suspicious")) {
                score += 20;
            }
        }

        String description =
                complaint.getDescription();

        if (description != null &&
                description.length() > 200) {

            score += 10;
        }

        if (complaint.getExamLocation() != null &&
                !complaint.getExamLocation().isBlank()) {

            score += 5;
        }

        return Math.min(score, 100);
    }

    public String getRiskLevel(int riskScore) {

        if (riskScore >= 80) {
            return "CRITICAL";
        }

        if (riskScore >= 60) {
            return "HIGH";
        }

        if (riskScore >= 40) {
            return "MEDIUM";
        }

        return "LOW";
    }

    public String getRecommendedAction(int riskScore) {

        if (riskScore >= 80) {
            return "Immediate investigation required";
        }

        if (riskScore >= 60) {
            return "Forward to authorized officer for investigation";
        }

        if (riskScore >= 40) {
            return "Review complaint and verify evidence";
        }

        return "Keep under preliminary review";
    }
}