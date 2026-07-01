package com.clinexa.otp;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetVerificationRepository
        extends JpaRepository<PasswordResetVerification, Long> {

    Optional<PasswordResetVerification> findTopByEmailIgnoreCaseOrderByCreatedAtDesc(
            String email
    );

    void deleteByEmailIgnoreCase(String email);
}