package com.clinexa.receptionist;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/receptionists")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ReceptionistController {

    private final ReceptionistService service;

    @PostMapping
    public Receptionist create(
            @RequestBody Receptionist receptionist
    ) {

        return service.create(receptionist);
    }

    @GetMapping
    public List<Receptionist> getAll() {

        return service.getAll();
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id
    ) {

        service.delete(id);
    }

    @GetMapping("/{id}")
    public Receptionist getReceptionistById(
            @PathVariable Long id
    ) {

        return service
                .getReceptionistById(id);
    }


    @PutMapping("/{id}/toggle-status")
    public Receptionist toggleStatus(
            @PathVariable Long id
    ) {
        return service.toggleStatus(id);
    }
    @GetMapping("/count")
    public long getReceptionistCount() {
        return service.getReceptionistCount();
    }

    @GetMapping("/count/active")
    public long getActiveReceptionistCount() {
        return service.getActiveReceptionistCount();
    }

    @GetMapping("/count/inactive")
    public long getInactiveReceptionistCount() {
        return service.getInactiveReceptionistCount();
    }

}