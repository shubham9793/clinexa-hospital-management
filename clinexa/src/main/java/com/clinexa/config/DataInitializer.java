package com.clinexa.config;


import com.clinexa.User.User;
import com.clinexa.User.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.clinexa.role.Role;
import com.clinexa.role.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
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

        createDefaultSuperAdmin();
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


    private void createDefaultSuperAdmin() {

        boolean exists = userRepository
                .findByEmailIgnoreCase("superadmin@clinexa.com")
                .isPresent();

        if (exists) {
            return;
        }

        Role superAdminRole = roleRepository
                .findByName("SUPER_ADMIN")
                .orElseThrow();

        User superAdmin = User.builder()
                .name("SHUBHAM")
                .email("superadmin@clinexa.com")
                .phone("9793863160")
                .password(
                        passwordEncoder.encode("admin123")
                )
                .role(superAdminRole)
                .build();

        userRepository.save(superAdmin);

        System.out.println(
                "SUPER ADMIN CREATED SUCCESSFULLY"
        );
    }
}