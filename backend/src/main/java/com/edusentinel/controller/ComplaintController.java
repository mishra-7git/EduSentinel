package com.edusentinel.controller;

import com.edusentinel.dto.ComplaintRequest;
import com.edusentinel.dto.ComplaintResponse;
import com.edusentinel.service.ComplaintService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(
        origins = {
                "http://localhost:5500",
                "http://127.0.0.1:5500"
        }
)
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<?> createComplaint(
            @Valid @RequestBody ComplaintRequest request) {

        try {

            ComplaintResponse response =
                    complaintService.createComplaint(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception e) {

            Map<String, Object> error = new HashMap<>();

            error.put("success", false);
            error.put(
                    "message",
                    e.getMessage() != null
                            ? e.getMessage()
                            : "Unable to submit complaint"
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);
        }
    }

    @GetMapping("/{complaintId}")
    public ResponseEntity<?> getComplaint(
            @PathVariable String complaintId) {

        try {

            ComplaintResponse response =
                    complaintService.getComplaint(complaintId);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            Map<String, Object> error = new HashMap<>();

            error.put("success", false);
            error.put(
                    "message",
                    e.getMessage() != null
                            ? e.getMessage()
                            : "Complaint not found"
            );

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(error);
        }
    }
}