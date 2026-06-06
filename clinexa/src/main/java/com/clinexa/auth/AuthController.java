package com.clinexa.auth;

import com.clinexa.auth.dto.AuthResponse;
import com.clinexa.auth.dto.LoginRequest;
import com.clinexa.patient.dto.PatientRegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /*
     * Public Patient self-registration.
     *
     * POST /auth/register/patient
     */
    @PostMapping("/register/patient")
    public String registerPatient(
            @RequestBody PatientRegisterRequest request
    ) {

        return authService.registerPatient(request);
    }

    /*
     * Login for all roles.
     *
     * POST /auth/login
     */
    @PostMapping("/login")
    public AuthResponse login(
            @RequestBody LoginRequest request
    ) {

        return authService.login(request);
    }
}