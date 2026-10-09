package com.edusentinel.service;

import com.edusentinel.entity.Notification;
import com.edusentinel.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository) {

        this.notificationRepository =
                notificationRepository;
    }

    public Notification createNotification(
            String title,
            String message,
            String recipient,
            String complaintId,
            String type) {

        Notification notification =
                new Notification();

        notification.setTitle(title);

        notification.setMessage(message);

        notification.setRecipient(recipient);

        notification.setComplaintId(complaintId);

        notification.setType(type);

        notification.setRead(false);

        notification.setCreatedAt(
                LocalDateTime.now()
        );

        return notificationRepository.save(
                notification
        );
    }

    public List<Notification> getNotifications(
            String recipient) {

        return notificationRepository
                .findByRecipient(recipient);
    }

    public List<Notification> getUnreadNotifications(
            String recipient) {

        return notificationRepository
                .findByRecipientAndIsRead(
                        recipient,
                        false
                );
    }

    public List<Notification> getComplaintNotifications(
            String complaintId) {

        return notificationRepository
                .findByComplaintId(
                        complaintId
                );
    }

    public Notification markAsRead(
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

    public void deleteNotification(
            Long notificationId) {

        if (!notificationRepository
                .existsById(notificationId)) {

            throw new RuntimeException(
                    "Notification not found"
            );
        }

        notificationRepository.deleteById(
                notificationId
        );
    }
}