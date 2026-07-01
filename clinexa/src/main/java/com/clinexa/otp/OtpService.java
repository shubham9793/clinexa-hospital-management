package com.clinexa.otp;

import com.clinexa.exception.BadRequestException;
import com.clinexa.otp.dto.OtpPurpose;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final EmailVerificationRepository repository;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void generateAndSendOtp(String email, OtpPurpose purpose) {
        String normalizedEmail = email.trim().toLowerCase();

        repository.deleteByEmailIgnoreCaseAndPurpose(
                normalizedEmail,
                purpose
        );

        String otp = String.valueOf(
                100000 + secureRandom.nextInt(900000)
        );

        EmailVerification verification = EmailVerification.builder()
                .email(normalizedEmail)
                .otp(otp)
                .purpose(purpose)
                .expiryTime(LocalDateTime.now().plusMinutes(5))
                .verified(false)
                .createdAt(LocalDateTime.now())
                .build();

        repository.save(verification);

        emailService.sendOtpEmail(
                normalizedEmail,
                otp,
                purpose
        );
    }

    @Transactional
    public void verifyOtp(String email, String otp, OtpPurpose purpose) {
        String normalizedEmail = email.trim().toLowerCase();

        EmailVerification verification = repository
                .findTopByEmailIgnoreCaseAndPurposeOrderByCreatedAtDesc(
                        normalizedEmail,
                        purpose
                )
                .orElseThrow(() ->
                        new BadRequestException("OTP not found. Please request a new OTP.")
                );

        if (verification.getExpiryTime().isBefore(LocalDateTime.now())) {
            repository.delete(verification);
            throw new BadRequestException("OTP has expired. Please request a new OTP.");
        }

        if (!verification.getOtp().equals(otp)) {
            throw new BadRequestException("Invalid OTP.");
        }

        repository.delete(verification);
    }
}