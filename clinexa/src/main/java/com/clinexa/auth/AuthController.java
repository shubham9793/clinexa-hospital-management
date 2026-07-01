package com.clinexa.auth;

import com.clinexa.auth.dto.AuthResponse;
import com.clinexa.auth.dto.ForgotPasswordRequest;
import com.clinexa.auth.dto.LoginRequest;
import com.clinexa.auth.dto.ResetPasswordRequest;
import com.clinexa.auth.dto.VerifyForgotPasswordOtpRequest;
import com.clinexa.otp.dto.ResendOtpRequest;
import com.clinexa.otp.dto.VerifyOtpRequest;
import com.clinexa.patient.dto.PatientRegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/patient")
    public String registerPatient(@RequestBody PatientRegisterRequest request) {
        return authService.registerPatient(request);
    }

    @PostMapping("/verify-email-otp")
    public String verifyEmailOtp(@RequestBody VerifyOtpRequest request) {
        return authService.verifyEmailOtp(request);
    }

    @PostMapping("/resend-email-otp")
    public String resendEmailOtp(@RequestBody ResendOtpRequest request) {
        return authService.resendEmailOtp(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    @PostMapping("/verify-forgot-password-otp")
    public String verifyForgotPasswordOtp(
            @RequestBody VerifyForgotPasswordOtpRequest request
    ) {
        return authService.verifyForgotPasswordOtp(request);
    }

    @PutMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {
        return authService.resetPassword(request);
    }
}