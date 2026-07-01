package com.clinexa.auth;

import com.clinexa.User.User;
import com.clinexa.User.UserRepository;
import com.clinexa.auth.dto.*;
import com.clinexa.exception.AuthException;
import com.clinexa.exception.BadRequestException;
import com.clinexa.exception.DuplicateResourceException;
import com.clinexa.exception.ResourceNotFoundException;
import com.clinexa.otp.OtpService;
import com.clinexa.otp.PasswordResetVerificationService;
import com.clinexa.otp.dto.OtpPurpose;
import com.clinexa.otp.dto.ResendOtpRequest;
import com.clinexa.otp.dto.VerifyOtpRequest;
import com.clinexa.patient.Patient;
import com.clinexa.patient.PatientRepository;
import com.clinexa.patient.dto.PatientRegisterRequest;
import com.clinexa.role.Role;
import com.clinexa.role.RoleRepository;
import com.clinexa.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final OtpService otpService;
    private final PasswordResetVerificationService passwordResetVerificationService;

    @Transactional
    public String registerPatient(PatientRegisterRequest request) {
        validatePatientRegistration(request);

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new DuplicateResourceException(
                    "An account already exists with this email."
            );
        }

        if (patientRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException(
                    "A patient profile already exists with this email."
            );
        }

        Role patientRole = roleRepository.findByName("PATIENT")
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "PATIENT role is not configured."
                        )
                );

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .phone(request.getPhone().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(patientRole)
                .enabled(false)
                .build();

        userRepository.save(user);

        Patient patient = Patient.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .phone(request.getPhone().trim())
                .gender(request.getGender().trim())
                .dob(request.getDob())
                .address(
                        request.getAddress() == null
                                ? null
                                : request.getAddress().trim()
                )
                .active(true)
                .build();

        patientRepository.save(patient);

        otpService.generateAndSendOtp(
                normalizedEmail,
                OtpPurpose.EMAIL_VERIFICATION
        );

        return "Registration successful. OTP sent to your email.";
    }

    public AuthResponse login(LoginRequest request) {
        if (
                request == null ||
                        request.getEmail() == null ||
                        request.getEmail().isBlank() ||
                        request.getPassword() == null ||
                        request.getPassword().isBlank()
        ) {
            throw new BadRequestException("Email and password are required.");
        }

        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() ->
                        new AuthException("Invalid email or password.")
                );

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AuthException("Invalid email or password.");
        }

        if (!user.isEnabled()) {
            throw new AuthException("Please verify your email before logging in.");
        }

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().getName())
                .build();
    }

    @Transactional
    public String verifyEmailOtp(VerifyOtpRequest request) {
        if (
                request == null ||
                        request.getEmail() == null ||
                        request.getEmail().isBlank() ||
                        request.getOtp() == null ||
                        request.getOtp().isBlank()
        ) {
            throw new BadRequestException("Email and OTP are required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        otpService.verifyOtp(
                email,
                request.getOtp().trim(),
                OtpPurpose.EMAIL_VERIFICATION
        );

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        user.setEnabled(true);
        userRepository.save(user);

        return "Email verified successfully. You can now login.";
    }

    public String resendEmailOtp(ResendOtpRequest request) {
        if (
                request == null ||
                        request.getEmail() == null ||
                        request.getEmail().isBlank()
        ) {
            throw new BadRequestException("Email is required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        if (user.isEnabled()) {
            throw new BadRequestException("Email is already verified.");
        }

        otpService.generateAndSendOtp(
                email,
                OtpPurpose.EMAIL_VERIFICATION
        );

        return "OTP sent successfully.";
    }

    public String forgotPassword(ForgotPasswordRequest request) {
        if (
                request == null ||
                        request.getEmail() == null ||
                        request.getEmail().isBlank()
        ) {
            throw new BadRequestException("Email is required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No account found with this email."
                        )
                );

        otpService.generateAndSendOtp(
                email,
                OtpPurpose.FORGOT_PASSWORD
        );

        return "Password reset OTP sent successfully.";
    }

    @Transactional
    public String verifyForgotPasswordOtp(
            VerifyForgotPasswordOtpRequest request
    ) {
        if (
                request == null ||
                        request.getEmail() == null ||
                        request.getEmail().isBlank() ||
                        request.getOtp() == null ||
                        request.getOtp().isBlank()
        ) {
            throw new BadRequestException("Email and OTP are required.");
        }

        String email = request.getEmail().trim().toLowerCase();

        otpService.verifyOtp(
                email,
                request.getOtp().trim(),
                OtpPurpose.FORGOT_PASSWORD
        );

        passwordResetVerificationService.createVerification(email);

        return "OTP verified successfully. You can now reset your password.";
    }

    @Transactional
    public String resetPassword(ResetPasswordRequest request) {
        if (
                request == null ||
                        request.getEmail() == null ||
                        request.getEmail().isBlank() ||
                        request.getNewPassword() == null ||
                        request.getNewPassword().isBlank()
        ) {
            throw new BadRequestException("Email and new password are required.");
        }

        if (request.getNewPassword().length() < 6) {
            throw new BadRequestException(
                    "Password must contain at least 6 characters."
            );
        }

        String email = request.getEmail().trim().toLowerCase();

        passwordResetVerificationService.validateAndDelete(email);

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found.")
                );

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password updated successfully.";
    }

    private void validatePatientRegistration(PatientRegisterRequest request) {
        if (request == null) {
            throw new BadRequestException("Registration details are required.");
        }

        requireText(request.getName(), "Name is required.");
        requireText(request.getEmail(), "Email is required.");
        requireText(request.getPhone(), "Phone number is required.");
        requireText(request.getPassword(), "Password is required.");
        requireText(request.getGender(), "Gender is required.");

        if (request.getDob() == null) {
            throw new BadRequestException("Date of birth is required.");
        }

        if (request.getDob().isAfter(LocalDate.now())) {
            throw new BadRequestException(
                    "Date of birth cannot be in the future."
            );
        }

        if (request.getPassword().length() < 6) {
            throw new BadRequestException(
                    "Password must contain at least 6 characters."
            );
        }
    }

    private void requireText(String value, String errorMessage) {
        if (value == null || value.isBlank()) {
            throw new BadRequestException(errorMessage);
        }
    }
}