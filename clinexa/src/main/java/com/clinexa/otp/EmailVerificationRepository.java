package com.clinexa.otp;

import com.clinexa.otp.dto.OtpPurpose;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmailVerificationRepository
        extends JpaRepository<EmailVerification, Long> {

    Optional<EmailVerification> findTopByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc(
            String email,
            OtpPurpose purpose
    );

    void deleteByEmailIgnoreCaseAndPurpose(
            String email,
            OtpPurpose purpose
    );
}