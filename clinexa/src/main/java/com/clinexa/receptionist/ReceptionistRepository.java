package com.clinexa.receptionist;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReceptionistRepository
        extends JpaRepository<Receptionist, Long> {

    boolean existsByEmail(String email);

    long countByActiveTrue();

    long countByActiveFalse();

    List<Receptionist> findTop5ByOrderByCreatedAtDesc();
}