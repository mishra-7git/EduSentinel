package com.edusentinel.service;

import com.edusentinel.entity.Complaint;
import com.edusentinel.entity.Evidence;
import com.edusentinel.entity.Notification;
import com.edusentinel.repository.ComplaintRepository;
import com.edusentinel.repository.EvidenceRepository;
import com.edusentinel.repository.NotificationRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfficerService {

    private final ComplaintRepository complaintRepository;
    private final EvidenceRepository evidenceRepository;
    private final NotificationRepository notificationRepository;

    public OfficerService(
            ComplaintRepository complaintRepository,
            EvidenceRepository evidenceRepository,
            NotificationRepository notificationRepository) {

        this.complaintRepository = complaintRepository;
        this.evidenceRepository = evidenceRepository;
        this.notificationRepository = notificationRepository;
    }

    // =========================================================
    // COMPLAINT METHODS
    // =========================================================

    // Get all complaints
    public List<Complaint> getAllComplaints() {

        return complaintRepository.findAll();
    }

    // Get complaint by database ID
    public Complaint getComplaintById(Long id) {

        return complaintRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Complaint not found"
                        )
                );
    }

    // Get complaint by complaint ID
    public Complaint getComplaint(String complaintId) {

        return complaintRepository
                .findByComplaintId(complaintId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Complaint not found"
                        )
                );
    }

    // Get complaints by status
    public List<Complaint> getComplaintsByStatus(
            String status) {

        return complaintRepository
                .findAll()
                .stream()
                .filter(complaint ->
                        complaint.getStatus() != null &&
                        complaint.getStatus()
                                .equalsIgnoreCase(status))
                .toList();
    }

    // Get complaints by priority
    public List<Complaint> getComplaintsByPriority(
            String priority) {

        return complaintRepository
                .findAll()
                .stream()
                .filter(complaint ->
                        complaint.getPriority() != null &&
                        complaint.getPriority()
                                .equalsIgnoreCase(priority))
                .toList();
    }

    // Update complaint status
    public Complaint updateComplaintStatus(
            String complaintId,
            String status) {

        Complaint complaint =
                getComplaint(complaintId);

        complaint.setStatus(status);

        return complaintRepository.save(
                complaint
        );
    }

    // Update complaint status using database ID
    public Complaint updateComplaintStatus(
            Long id,
            String status) {

        Complaint complaint =
                getComplaintById(id);

        complaint.setStatus(status);

        return complaintRepository.save(
                complaint
        );
    }

    // Update complaint priority
    public Complaint updateComplaintPriority(
            String complaintId,
            String priority) {

        Complaint complaint =
                getComplaint(complaintId);

        complaint.setPriority(priority);

        return complaintRepository.save(
                complaint
        );
    }

    // Update complaint priority using database ID
    public Complaint updateComplaintPriority(
            Long id,
            String priority) {

        Complaint complaint =
                getComplaintById(id);

        complaint.setPriority(priority);

        return complaintRepository.save(
                complaint
        );
    }

    // =========================================================
    // COMPLAINT STATISTICS
    // =========================================================

    // Total complaints
    public long getTotalComplaints() {

        return complaintRepository.count();
    }

    // Count complaints by status
    public long getComplaintsByStatusCount(
            String status) {

        return complaintRepository
                .findAll()
                .stream()
                .filter(complaint ->
                        complaint.getStatus() != null &&
                        complaint.getStatus()
                                .equalsIgnoreCase(status))
                .count();
    }

    // Get high-risk complaints
    public List<Complaint> getHighRiskComplaints() {

        return complaintRepository
                .findAll()
                .stream()
                .filter(complaint ->
                        complaint.getRiskScore() != null &&
                        complaint.getRiskScore() >= 70)
                .toList();
    }

    // =========================================================
    // EVIDENCE METHODS
    // =========================================================

    // Get evidence for complaint using complaint ID string
    public List<Evidence> getComplaintEvidence(
            String complaintId) {

        return evidenceRepository
                .findByComplaintId(complaintId);
    }

    // Get evidence using database complaint ID
    public List<Evidence> getComplaintEvidence(
            Long complaintId) {

        Complaint complaint =
                getComplaintById(complaintId);

        return evidenceRepository
                .findByComplaintId(
                        complaint.getComplaintId()
                );
    }

    // Get all pending evidence
    public List<Evidence> getPendingEvidence() {

        return evidenceRepository
                .findByVerificationStatus("PENDING");
    }

    // Verify evidence
    public Evidence verifyEvidence(
            Long evidenceId,
            String verificationStatus) {

        Evidence evidence =
                evidenceRepository
                        .findById(evidenceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Evidence not found"
                                )
                        );

        evidence.setVerificationStatus(
                verificationStatus
        );

        return evidenceRepository.save(
                evidence
        );
    }

    // =========================================================
    // NOTIFICATION METHODS
    // =========================================================

    // Get all notifications for officer
    public List<Notification> getOfficerNotifications(
            String recipient) {

        return notificationRepository
                .findByRecipient(recipient);
    }

    // Get unread notifications
    public List<Notification> getUnreadNotifications(
            String recipient) {

        return notificationRepository
                .findByRecipientAndIsRead(
                        recipient,
                        false
                );
    }

    // Mark notification as read
    public Notification markNotificationAsRead(
            Long notificationId) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        notification.setRead(true);

        return notificationRepository.save(
                notification
        );
    }

    // Mark notification as read
    // Overload kept for controller compatibility
    public Notification markNotificationAsRead(
            String notificationId) {

        Long id;

        try {

            id = Long.parseLong(notificationId);

        } catch (NumberFormatException e) {

            throw new RuntimeException(
                    "Invalid notification ID"
            );
        }

        return markNotificationAsRead(id);
    }
}