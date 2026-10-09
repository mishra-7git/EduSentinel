package com.edusentinel.controller;

import com.edusentinel.entity.Evidence;
import com.edusentinel.service.EvidenceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/evidence")
@CrossOrigin(
        origins = {
                "http://localhost:5500",
                "http://127.0.0.1:5500"
        }
)
public class EvidenceController {

    private final EvidenceService evidenceService;

    public EvidenceController(
            EvidenceService evidenceService) {

        this.evidenceService = evidenceService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadEvidence(

            @RequestParam("file")
            MultipartFile file,

            @RequestParam("complaintId")
            String complaintId,

            @RequestParam("uploadedBy")
            String uploadedBy,

            @RequestParam(
                    value = "description",
                    required = false
            )
            String description) {

        try {

            Evidence evidence =
                    evidenceService.uploadEvidence(
                            file,
                            complaintId,
                            uploadedBy,
                            description
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Evidence uploaded successfully"
            );

            response.put(
                    "evidenceId",
                    evidence.getId()
            );

            response.put(
                    "fileName",
                    evidence.getFileName()
            );

            response.put(
                    "complaintId",
                    evidence.getComplaintId()
            );

            response.put(
                    "verificationStatus",
                    evidence.getVerificationStatus()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (IOException |
                 RuntimeException e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "success",
                    false
            );

            error.put(
                    "message",
                    e.getMessage() != null
                            ? e.getMessage()
                            : "Unable to upload evidence"
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);
        }
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<?> getEvidenceByComplaint(
            @PathVariable String complaintId) {

        try {

            List<Evidence> evidenceList =
                    evidenceService
                            .getEvidenceByComplaintId(
                                    complaintId
                            );

            return ResponseEntity.ok(
                    evidenceList
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
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingEvidence() {

        try {

            List<Evidence> evidenceList =
                    evidenceService
                            .getPendingEvidence();

            return ResponseEntity.ok(
                    evidenceList
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
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);
        }
    }

    @PutMapping("/{evidenceId}/status")
    public ResponseEntity<?> updateEvidenceStatus(

            @PathVariable Long evidenceId,

            @RequestParam("status")
            String status) {

        try {

            Evidence evidence =
                    evidenceService
                            .updateVerificationStatus(
                                    evidenceId,
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
                    "Evidence status updated successfully"
            );

            response.put(
                    "evidenceId",
                    evidence.getId()
            );

            response.put(
                    "status",
                    evidence
                            .getVerificationStatus()
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
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }
    }
}