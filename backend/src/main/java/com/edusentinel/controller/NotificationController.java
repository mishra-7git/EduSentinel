package com.edusentinel.controller;

import com.edusentinel.entity.Notification;
import com.edusentinel.service.NotificationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(
        origins = {
                "http://localhost:5500",
                "http://127.0.0.1:5500"
        }
)
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService =
                notificationService;
    }

    @PostMapping
    public ResponseEntity<?> createNotification(

            @RequestParam String title,

            @RequestParam String message,

            @RequestParam String recipient,

            @RequestParam(required = false)
            String complaintId,

            @RequestParam(required = false)
            String type) {

        try {

            Notification notification =
                    notificationService
                            .createNotification(
                                    title,
                                    message,
                                    recipient,
                                    complaintId,
                                    type
                            );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Notification created successfully"
            );

            response.put(
                    "notificationId",
                    notification.getId()
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

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

    @GetMapping("/recipient/{recipient}")
    public ResponseEntity<?> getNotifications(
            @PathVariable String recipient) {

        List<Notification> notifications =
                notificationService
                        .getNotifications(recipient);

        return ResponseEntity.ok(
                notifications
        );
    }

    @GetMapping("/recipient/{recipient}/unread")
    public ResponseEntity<?> getUnreadNotifications(
            @PathVariable String recipient) {

        List<Notification> notifications =
                notificationService
                        .getUnreadNotifications(
                                recipient
                        );

        return ResponseEntity.ok(
                notifications
        );
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<?> getComplaintNotifications(
            @PathVariable String complaintId) {

        List<Notification> notifications =
                notificationService
                        .getComplaintNotifications(
                                complaintId
                        );

        return ResponseEntity.ok(
                notifications
        );
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable Long notificationId) {

        try {

            Notification notification =
                    notificationService
                            .markAsRead(
                                    notificationId
                            );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Notification marked as read"
            );

            response.put(
                    "notificationId",
                    notification.getId()
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

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(
            @PathVariable Long notificationId) {

        try {

            notificationService
                    .deleteNotification(
                            notificationId
                    );

            Map<String, Object> response =
                    new HashMap<>();

            response.put(
                    "success",
                    true
            );

            response.put(
                    "message",
                    "Notification deleted successfully"
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