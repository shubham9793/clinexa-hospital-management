package com.clinexa.patient;

import com.clinexa.patient.dto.PatientRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientService {

    private final PatientRepository repo;

    public Patient create(PatientRequest req) {

        if (repo.existsByEmail(req.getEmail())) {
            throw new RuntimeException(
                    "Patient already exists with this email"
            );
        }

        Patient patient = Patient.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .gender(req.getGender())
                .dob(req.getDob())
                .address(req.getAddress())
                .active(req.isActive())
                .build();

        return repo.save(patient);
    }

    public List<Patient> getAll() {
        return repo.findAll();
    }

    public Patient getById(Long id) {

        return repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"
                        )
                );
    }

    public Patient update(
            Long id,
            PatientRequest req
    ) {

        Patient patient = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"
                        )
                );

        patient.setName(req.getName());
        patient.setEmail(req.getEmail());
        patient.setPhone(req.getPhone());
        patient.setGender(req.getGender());
        patient.setDob(req.getDob());
        patient.setAddress(req.getAddress());
        patient.setActive(req.isActive());

        return repo.save(patient);
    }

    public void delete(Long id) {

        Patient patient = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"
                        )
                );

        repo.delete(patient);
    }

    public Patient toggleStatus(Long id) {

        Patient patient = repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found"
                        )
                );

        patient.setActive(
                !patient.isActive()
        );

        return repo.save(patient);
    }

    public long getPatientCount() {
        return repo.count();
    }

    public long getActivePatientCount() {
        return repo.countByActiveTrue();
    }

    public long getInactivePatientCount() {
        return repo.countByActiveFalse();
    }
}