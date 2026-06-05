package com.clinexa.patient;

import com.clinexa.patient.dto.PatientRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService service;

    @PostMapping
    public Patient create(
            @RequestBody PatientRequest request
    ) {
        return service.create(request);
    }

    @GetMapping
    public List<Patient> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Patient getById(
            @PathVariable Long id
    ) {
        return service.getById(id);
    }

    @PutMapping("/{id}")
    public Patient update(
            @PathVariable Long id,
            @RequestBody PatientRequest request
    ) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {
        service.delete(id);
    }

    @PutMapping("/{id}/toggle-status")
    public Patient toggleStatus(
            @PathVariable Long id
    ) {
        return service.toggleStatus(id);
    }

    @GetMapping("/count")
    public long getPatientCount() {
        return service.getPatientCount();
    }

    @GetMapping("/count/active")
    public long getActivePatientCount() {
        return service.getActivePatientCount();
    }

    @GetMapping("/count/inactive")
    public long getInactivePatientCount() {
        return service.getInactivePatientCount();
    }
}