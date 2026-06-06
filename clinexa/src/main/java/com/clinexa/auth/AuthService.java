package com.clinexa.auth;

import com.clinexa.User.User;
import com.clinexa.User.UserRepository;
import com.clinexa.auth.dto.AuthResponse;
import com.clinexa.auth.dto.LoginRequest;
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

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final PatientRepository patientRepository;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    /*
     * ========================================
     * PATIENT SELF-REGISTRATION
     * ========================================
     */

    @Transactional
    public String registerPatient(
            PatientRegisterRequest request
    ) {

        validatePatientRegistration(request);

        String normalizedEmail =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new RuntimeException(
                    "An account already exists with this email"
            );
        }

        if (patientRepository.existsByEmail(normalizedEmail)) {
            throw new RuntimeException(
                    "A patient profile already exists with this email"
            );
        }

        Role patientRole = roleRepository
                .findByName("PATIENT")
                .orElseThrow(() ->
                        new RuntimeException(
                                "PATIENT role is not configured"
                        )
                );

        /*
         * Create login account.
         */
        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .phone(request.getPhone().trim())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(patientRole)
                .enabled(true)
                .build();

        userRepository.save(user);

        /*
         * Create Patient profile.
         */
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

        return "Patient Registered Successfully";
    }

    /*
     * ========================================
     * LOGIN
     * ========================================
     */

    public AuthResponse login(
            LoginRequest request
    ) {

        if (
                request == null
                        || request.getEmail() == null
                        || request.getPassword() == null
        ) {

            throw new RuntimeException(
                    "Email and password are required"
            );
        }

        String normalizedEmail =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        User user = userRepository
                .findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Invalid email or password"
                        )
                );

        if (
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        if (!user.isEnabled()) {
            throw new RuntimeException(
                    "Your account is inactive"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().getName())
                .build();
    }

    /*
     * ========================================
     * VALIDATION
     * ========================================
     */

    private void validatePatientRegistration(
            PatientRegisterRequest request
    ) {

        if (request == null) {
            throw new RuntimeException(
                    "Registration details are required"
            );
        }

        requireText(
                request.getName(),
                "Name is required"
        );

        requireText(
                request.getEmail(),
                "Email is required"
        );

        requireText(
                request.getPhone(),
                "Phone number is required"
        );

        requireText(
                request.getPassword(),
                "Password is required"
        );

        requireText(
                request.getGender(),
                "Gender is required"
        );

        if (request.getDob() == null) {
            throw new RuntimeException(
                    "Date of birth is required"
            );
        }

        if (request.getDob().isAfter(
                java.time.LocalDate.now()
        )) {

            throw new RuntimeException(
                    "Date of birth cannot be in the future"
            );
        }

        if (request.getPassword().length() < 6) {
            throw new RuntimeException(
                    "Password must contain at least 6 characters"
            );
        }
    }

    private void requireText(
            String value,
            String errorMessage
    ) {

        if (
                value == null
                        || value.isBlank()
        ) {

            throw new RuntimeException(
                    errorMessage
            );
        }
    }
}