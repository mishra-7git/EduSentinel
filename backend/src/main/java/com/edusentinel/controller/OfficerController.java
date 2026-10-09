package com.edusentinel.controller;

import com.edusentinel.entity.Complaint;
import com.edusentinel.service.OfficerService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@CrossOrigin(
        origins = {
                "http://localhost:5500",
                "http://127.0.0.1:5500"
        }
)
public class OfficerController {

    private final OfficerService officerService;

    public OfficerController(
            OfficerService officerService) {

        this.officerService =
                officerService;
    }

    @GetMapping("/complaints")
    public ResponseEntity<?> getAllComplaints() {

        List<Complaint> complaints =
                officerService.getAllComplaints();

        return ResponseEntity.ok(
                complaints
        );
    }

    @GetMapping("/complaints/status/{status}")
    public ResponseEntity<?> getComplaintsByStatus(
            @PathVariable String status) {

        List<Complaint> complaints =
                officerService
                        .getComplaintsByStatus(status);

        return ResponseEntity.ok(
                complaints
        );
    }

    @GetMapping("/complaints/priority/{priority}")
    public ResponseEntity<?> getComplaintsByPriority(
            @PathVariable String priority) {

        List<Complaint> complaints =
                officerService
                        .getComplaintsByPriority(
                                priority
                        );

        return ResponseEntity.ok(
                complaints
        );
    }

    @GetMapping("/complaints/{id}")
    public ResponseEntity<?> getComplaint(
            @PathVariable Long id) {

        try {

            Complaint complaint =
                    officerService
                            .getComplaintById(id);

            return ResponseEntity.ok(
                    complaint
            );

        } catch (RuntimeException e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "success",
                    false
            );

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    @PutMapping("/complaints/{id}/status")
    public ResponseEntity<?> updateStatus(

            @PathVariable Long id,

            @RequestParam String status) {

        try {

            Complaint complaint =
                    officerService
                            .updateComplaintStatus(
                                    id,
                                    status
                            );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Complaint status updated successfully"
            );

            response.put(
                    "complaint",
                    complaint
            );

            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "success",
                    false
            );

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }

    @PutMapping("/complaints/{id}/priority")
    public ResponseEntity<?> updatePriority(

            @PathVariable Long id,

            @RequestParam String priority) {

        try {

            Complaint complaint =
                    officerService
                            .updateComplaintPriority(
                                    id,
                                    priority
                            );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Complaint priority updated successfully"
            );

            response.put(
                    "complaint",
                    complaint
            );

            return ResponseEntity.ok(
                    response
            );

        } catch (RuntimeException e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "success",
                    false
            );

            error.put(
                    "message",
                    e.getMessage()
            );

            return ResponseEntity
                    .badRequest()
                    .body(error);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {

        Map<String, Object> statistics =
                new HashMap<>();

        statistics.put(
                "totalComplaints",
                officerService
                        .getTotalComplaints()
        );

        statistics.put(
                "received",
                officerService
                        .getComplaintsByStatusCount(
                                "Received"
                        )
        );

        statistics.put(
                "underReview",
                officerService
                        .getComplaintsByStatusCount(
                                "Under Review"
                        )
        );

        statistics.put(
                "investigating",
                officerService
                        .getComplaintsByStatusCount(
                                "Investigating"
                        )
        );

        statistics.put(
                "resolved",
                officerService
                        .getComplaintsByStatusCount(
                                "Resolved"
                        )
        );

        statistics.put(
                "highRisk",
                officerService
                        .getHighRiskComplaints()
        );

        return ResponseEntity.ok(
                statistics
        );
    }
}