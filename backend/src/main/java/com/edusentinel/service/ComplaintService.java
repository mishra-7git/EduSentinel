package com.edusentinel.service;

import com.edusentinel.dto.ComplaintRequest;
import com.edusentinel.dto.ComplaintResponse;
import com.edusentinel.entity.Complaint;
import com.edusentinel.repository.ComplaintRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Random;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final NotificationService notificationService;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            NotificationService notificationService) {

        this.complaintRepository = complaintRepository;
        this.notificationService = notificationService;
    }

    public ComplaintResponse createComplaint(
            ComplaintRequest request) {

        Complaint complaint = new Complaint();

        String complaintId =
                generateComplaintId();

        complaint.setComplaintId(complaintId);
        complaint.setFullName(request.getFullName());
        complaint.setEmail(request.getEmail());
        complaint.setMobile(request.getMobile());
        complaint.setExamName(request.getExamName());
        complaint.setSubject(request.getSubject());
        complaint.setExamLocation(
                request.getExamLocation()
        );
        complaint.setIncidentType(
                request.getIncidentType()
        );
        complaint.setDescription(
                request.getDescription()
        );

        if (request.getExamDate() != null &&
                !request.getExamDate().isBlank()) {

            complaint.setExamDate(
                    LocalDate.parse(
                            request.getExamDate()
                    )
            );
        }

        if (request.getIncidentDate() != null &&
                !request.getIncidentDate().isBlank()) {

            complaint.setIncidentDate(
                    LocalDate.parse(
                            request.getIncidentDate()
                    )
            );
        }

        if (request.getIncidentTime() != null &&
                !request.getIncidentTime().isBlank()) {

            complaint.setIncidentTime(
                    LocalTime.parse(
                            request.getIncidentTime()
                    )
            );
        }

        complaint.setStatus("Received");
        complaint.setPriority("Medium");

        complaint.setRiskScore(
                calculateInitialRiskScore(request)
        );

        complaint.setSubmittedAt(
                LocalDateTime.now()
        );

        complaintRepository.save(complaint);

        // Create notification for the student
        if (request.getEmail() != null &&
                !request.getEmail().isBlank()) {

            notificationService.createNotification(

                    "Complaint Successfully Received",

                    "Your complaint " +
                            complaint.getComplaintId() +
                            " has been successfully received " +
                            "and is now under review.",

                    request.getEmail(),

                    complaint.getComplaintId(),

                    "IMPORTANT"
            );
        }

        return new ComplaintResponse(
                true,
                "Complaint submitted successfully",
                complaint.getComplaintId(),
                complaint.getStatus(),
                complaint.getPriority(),
                complaint.getRiskScore(),
                complaint.getIncidentType(),
                complaint.getExamName(),
                complaint.getSubmittedAt()
        );
    }

    public ComplaintResponse getComplaint(
            String complaintId) {

        Complaint complaint =
                complaintRepository
                        .findByComplaintId(complaintId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Complaint not found"
                                )
                        );

        return new ComplaintResponse(
                true,
                "Complaint found",
                complaint.getComplaintId(),
                complaint.getStatus(),
                complaint.getPriority(),
                complaint.getRiskScore(),
                complaint.getIncidentType(),
                complaint.getExamName(),
                complaint.getSubmittedAt()
        );
    }

    private String generateComplaintId() {

        Random random = new Random();

        String complaintId;

        do {

            int number =
                    10000 +
                    random.nextInt(90000);

            complaintId =
                    "EDU-2026-" + number;

        } while (
                complaintRepository
                        .existsByComplaintId(
                                complaintId
                        )
        );

        return complaintId;
    }

    private int calculateInitialRiskScore(
            ComplaintRequest request) {

        int score = 20;

        String incidentType =
                request.getIncidentType();

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

        if (request.getDescription() != null &&
                request.getDescription().length() > 200) {

            score += 10;
        }

        return Math.min(score, 100);
    }
}