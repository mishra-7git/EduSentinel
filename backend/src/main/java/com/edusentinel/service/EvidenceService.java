package com.edusentinel.service;

import com.edusentinel.entity.Evidence;
import com.edusentinel.repository.EvidenceRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class EvidenceService {

    private final EvidenceRepository evidenceRepository;

    private final Path uploadDirectory =
            Paths.get("uploads/evidence");

    public EvidenceService(
            EvidenceRepository evidenceRepository) {

        this.evidenceRepository = evidenceRepository;
    }

    public Evidence uploadEvidence(
            MultipartFile file,
            String complaintId,
            String uploadedBy,
            String description) throws IOException {

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Evidence file is required"
            );
        }

        if (complaintId == null ||
                complaintId.isBlank()) {

            throw new RuntimeException(
                    "Complaint ID is required"
            );
        }

        Files.createDirectories(uploadDirectory);

        String originalFileName =
                file.getOriginalFilename();

        if (originalFileName == null ||
                originalFileName.isBlank()) {

            throw new RuntimeException(
                    "Invalid file name"
            );
        }

        String safeFileName =
                System.currentTimeMillis()
                        + "_"
                        + originalFileName
                                .replaceAll(
                                        "[^a-zA-Z0-9._-]",
                                        "_"
                                );

        Path targetPath =
                uploadDirectory.resolve(
                        safeFileName
                );

        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
        );

        Evidence evidence = new Evidence();

        evidence.setFileName(originalFileName);

        evidence.setFileType(
                file.getContentType() != null
                        ? file.getContentType()
                        : "unknown"
        );

        evidence.setFileSize(
                file.getSize()
        );

        evidence.setFilePath(
                targetPath.toString()
        );

        evidence.setDescription(
                description
        );

        evidence.setComplaintId(
                complaintId
        );

        evidence.setUploadedBy(
                uploadedBy
        );

        evidence.setVerificationStatus(
                "PENDING"
        );

        evidence.setUploadedAt(
                LocalDateTime.now()
        );

        return evidenceRepository.save(
                evidence
        );
    }

    public List<Evidence> getEvidenceByComplaintId(
            String complaintId) {

        return evidenceRepository
                .findByComplaintId(
                        complaintId
                );
    }

    public List<Evidence> getPendingEvidence() {

        return evidenceRepository
                .findByVerificationStatus(
                        "PENDING"
                );
    }

    public Evidence updateVerificationStatus(
            Long evidenceId,
            String status) {

        Evidence evidence =
                evidenceRepository
                        .findById(evidenceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Evidence not found"
                                )
                        );

        evidence.setVerificationStatus(
                status
        );

        return evidenceRepository.save(
                evidence
        );
    }
}