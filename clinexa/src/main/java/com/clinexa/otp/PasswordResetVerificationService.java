package com.clinexa.otp;

import com.clinexa.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PasswordResetVerificationService {

    private final PasswordResetVerificationRepository repository;

    @Transactional
    public void createVerification(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        repository.deleteByEmailIgnoreCase(normalizedEmail);

        PasswordResetVerification verification =
                PasswordResetVerification.builder()
                        .email(normalizedEmail)
                        .expiryTime(LocalDateTime.now().plusMinutes(10))
                        .createdAt(LocalDateTime.now())
                        .build();

        repository.save(verification);
    }

    @Transactional
    public void validateAndDelete(String email) {
        String normalizedEmail = email.trim().toLowerCase();

        PasswordResetVerification verification = repository
                .findTopByEmailIgnoreCaseOrderByCreatedAtDesc(normalizedEmail)
                .orElseThrow(() ->
                        new BadRequestException(
                                "Please verify OTP before resetting password."
                        )
                );

        if (verification.getExpiryTime().isBefore(LocalDateTime.now())) {
            repository.delete(verification);

            throw new BadRequestException(
                    "Password reset verification expired. Please request a new OTP."
            );
        }

        repository.delete(verification);
    }
}