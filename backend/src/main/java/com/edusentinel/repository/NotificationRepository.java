package com.edusentinel.repository;

import com.edusentinel.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipient(String recipient);

    List<Notification> findByRecipientAndIsRead(
            String recipient,
            boolean isRead
    );

    List<Notification> findByComplaintId(
            String complaintId
    );
}