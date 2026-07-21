package com.clinexa.superadmin;

import com.clinexa.User.User;
import com.clinexa.User.UserRepository;
import com.clinexa.User.dto.CreateUserRequest;
import com.clinexa.role.Role;
import com.clinexa.role.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.clinexa.superadmin.dto.AdminResponse;
import java.util.List;

import java.util.List;

@RestController
@RequestMapping("/super-admin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // =========================
    // CREATE ADMIN
    // =========================

    @PostMapping("/admins")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public String createAdmin(
            @RequestBody CreateUserRequest request
    ) {

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        if (userRepository
                .findByEmailIgnoreCase(email)
                .isPresent()) {

            return "User already exists";
        }

        Role adminRole = roleRepository
                .findByName("ADMIN")
                .orElseThrow(() ->
                        new RuntimeException(
                                "ADMIN role not found"
                        )
                );

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .phone(request.getPhone())
                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )
                .role(adminRole)
                .enabled(true)
                .build();

        userRepository.save(user);

        return "Admin created successfully";
    }

    // =========================
    // GET ALL ADMINS
    // =========================

    @GetMapping("/admins")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public List<AdminResponse> getAllAdmins() {

        return userRepository.findAll()
                .stream()
                .filter(user ->
                        user.getRole() != null &&
                                "ADMIN".equals(user.getRole().getName())
                )
                .map(user ->
                        AdminResponse.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .email(user.getEmail())
                                .phone(user.getPhone())
                                .enabled(user.isEnabled())
                                .build()
                )
                .toList();
    }

    // =========================
    // ENABLE / DISABLE ADMIN
    // =========================

    @PutMapping("/admins/{id}/status")
    @PreAuthorize("hasAuthority('SUPER_ADMIN')")
    public String updateAdminStatus(
            @PathVariable Long id,
            @RequestParam boolean enabled
    ) {

        User admin = userRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Admin not found"
                        )
                );

        if (
                admin.getRole() == null ||
                        !"ADMIN".equals(
                                admin.getRole().getName()
                        )
        ) {
            throw new RuntimeException(
                    "Selected user is not an ADMIN"
            );
        }

        admin.setEnabled(enabled);

        userRepository.save(admin);

        return enabled
                ? "Admin activated successfully"
                : "Admin deactivated successfully";
    }


}