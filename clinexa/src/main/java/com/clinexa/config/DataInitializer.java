package com.clinexa.config;

import com.clinexa.User.User;
import com.clinexa.User.UserRepository;
import com.clinexa.role.Role;
import com.clinexa.role.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        createRoleIfNotExists("SUPER_ADMIN");
        createRoleIfNotExists("ADMIN");
        createRoleIfNotExists("DOCTOR");
        createRoleIfNotExists("RECEPTIONIST");
        createRoleIfNotExists("PATIENT");

        createOrEnableDefaultSuperAdmin();
    }

    private void createRoleIfNotExists(String roleName) {

        roleRepository.findByName(roleName)
                .orElseGet(() -> {

                    Role role = Role.builder()
                            .name(roleName)
                            .build();

                    return roleRepository.save(role);
                });
    }

    private void createOrEnableDefaultSuperAdmin() {

        String email = "superadmin@clinexa.com";

        Role superAdminRole = roleRepository
                .findByName("SUPER_ADMIN")
                .orElseThrow(() ->
                        new RuntimeException("SUPER_ADMIN role not found")
                );

        userRepository.findByEmailIgnoreCase(email)
                .ifPresentOrElse(

                        existingUser -> {

                            boolean changed = false;

                            if (!existingUser.isEnabled()) {
                                existingUser.setEnabled(true);
                                changed = true;
                            }

                            if (existingUser.getRole() == null ||
                                    !"SUPER_ADMIN".equals(
                                            existingUser.getRole().getName()
                                    )) {

                                existingUser.setRole(superAdminRole);
                                changed = true;
                            }

                            if (changed) {
                                userRepository.save(existingUser);
                                System.out.println(
                                        "SUPER ADMIN UPDATED SUCCESSFULLY"
                                );
                            } else {
                                System.out.println(
                                        "SUPER ADMIN ALREADY EXISTS"
                                );
                            }
                        },

                        () -> {

                            User superAdmin = User.builder()
                                    .name("SHUBHAM")
                                    .email(email)
                                    .phone("9793863160")
                                    .password(
                                            passwordEncoder.encode("admin123")
                                    )
                                    .role(superAdminRole)

                                    // IMPORTANT
                                    .enabled(true)

                                    .build();

                            userRepository.save(superAdmin);

                            System.out.println(
                                    "SUPER ADMIN CREATED SUCCESSFULLY"
                            );
                        }
                );
    }
}