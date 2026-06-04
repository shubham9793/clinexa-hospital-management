package com.clinexa.receptionist;

import com.clinexa.role.Role;
import com.clinexa.role.RoleRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceptionistService {

    private final ReceptionistRepository repo;

    private final RoleRepository roleRepository;

    private final PasswordEncoder passwordEncoder;

    public Receptionist create(
            Receptionist receptionist
    ) {

        Role role =
                roleRepository
                        .findByName("RECEPTIONIST")
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Role not found"
                                )
                        );

        receptionist.setRole(role);

        receptionist.setPassword(
                passwordEncoder.encode(
                        receptionist.getPassword()
                )
        );

        return repo.save(receptionist);
    }

    public List<Receptionist> getAll() {

        return repo.findAll();
    }


    public Receptionist updateReceptionist(
            Long id,
            Receptionist updatedReceptionist
    ) {

        Receptionist receptionist =
                repo.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Receptionist not found"
                                )
                        );

        receptionist.setName(
                updatedReceptionist.getName()
        );

        receptionist.setEmail(
                updatedReceptionist.getEmail()
        );

        receptionist.setPhone(
                updatedReceptionist.getPhone()
        );

        // UPDATE PASSWORD ONLY IF ENTERED

        if (
                updatedReceptionist.getPassword() != null
                        &&
                        !updatedReceptionist
                                .getPassword()
                                .isEmpty()
        ) {

            receptionist.setPassword(
                    passwordEncoder.encode(
                            updatedReceptionist.getPassword()
                    )
            );
        }

        return repo
                .save(
                receptionist
        );
    }

    public void delete(Long id) {

        repo.deleteById(id);
    }

    public Receptionist getReceptionistById(
            Long id
    ) {

        return repo
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Receptionist not found"
                        )
                );
    }


    public Receptionist toggleStatus(
            Long id
    ) {

        Receptionist receptionist =
                repo.findById(id)

                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Receptionist not found"
                                )
                        );

        receptionist.setActive(
                !receptionist.isActive()
        );

        return repo.save(
                receptionist
        );
    }


    public long getReceptionistCount() {
        return repo.count();
    }

    public long getActiveReceptionistCount() {
        return repo.countByActiveTrue();
    }

    public long getInactiveReceptionistCount() {
        return repo.countByActiveFalse();
    }
}