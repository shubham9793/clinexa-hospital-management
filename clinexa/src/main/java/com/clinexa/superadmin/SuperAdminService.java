package com.clinexa.superadmin;

import com.clinexa.User.User;
import com.clinexa.User.UserRepository;
import com.clinexa.role.Role;
import com.clinexa.role.RoleRepository;
import com.clinexa.superadmin.dto.AdminCreateRequest;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public String createAdmin(AdminCreateRequest request) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Check duplicate email
        if (userRepository.findByEmailIgnoreCase(email).isPresent()) {
            throw new RuntimeException(
                    "User with this email already exists."
            );
        }

        // Get ADMIN role
        Role adminRole = roleRepository
                .findByName("ADMIN")
                .orElseThrow(() ->
                        new RuntimeException(
                                "ADMIN role not found."
                        )
                );

        User admin = User.builder()
                .name(request.getName().trim())
                .email(email)
                .phone(request.getPhone())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(adminRole)

                // Admin should be able to login immediately
                .enabled(true)

                .build();

        userRepository.save(admin);

        return "Admin created successfully.";
    }
}