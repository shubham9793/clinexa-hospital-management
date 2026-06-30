package com.clinexa.doctor;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    boolean existsByEmailIgnoreCase(String email);

    long countByActiveTrue();

    long countByActiveFalse();

    List<Doctor> findTop5ByOrderByCreatedAtDesc();
}