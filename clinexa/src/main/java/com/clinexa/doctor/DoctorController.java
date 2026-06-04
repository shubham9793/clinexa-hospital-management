package com.clinexa.doctor;

import com.clinexa.doctor.dto.DoctorRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService service;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Doctor create(@RequestBody DoctorRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<Doctor> getAll() {
        return service.getAll();
    }


    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        service.delete(id);
    }

    @GetMapping("/{id}")
    public Doctor getDoctorById(
            @PathVariable Long id
    ) {

        return service.getDoctorById(id);
    }

    @PutMapping("/{id}")
    public Doctor updateDoctor(
            @PathVariable Long id,
            @RequestBody DoctorRequest request
    ) {

        return service
                .updateDoctor(id, request);
    }

    @PutMapping("/{id}/toggle-availability")
    public Doctor toggleAvailability(
            @PathVariable Long id
    ) {

        return service
                .toggleAvailability(id);
    }

    @GetMapping("/count")
    public long getDoctorCount() {

        return service.getDoctorCount();
    }

    @GetMapping("/count/active")
    public long getActiveDoctorCount() {
        return service.getActiveDoctorCount();
    }

    @GetMapping("/count/inactive")
    public long getInactiveDoctorCount() {
        return service.getInactiveDoctorCount();
    }
}