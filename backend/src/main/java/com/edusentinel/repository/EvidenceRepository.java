package com.edusentinel.repository;

import com.edusentinel.entity.Evidence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EvidenceRepository
        extends JpaRepository<Evidence, Long> {

    List<Evidence> findByComplaintId(String complaintId);

    List<Evidence> findByVerificationStatus(String verificationStatus);
}