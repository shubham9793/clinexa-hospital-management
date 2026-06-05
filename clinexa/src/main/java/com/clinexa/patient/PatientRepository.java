package com.clinexa.patient;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository
        extends JpaRepository<Patient, Long> {

    boolean existsByEmail(String email);

    long countByActiveTrue();

    long countByActiveFalse();

    List<Patient> findByNameContainingIgnoreCase(String name);
}