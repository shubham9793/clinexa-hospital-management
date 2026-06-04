package com.clinexa.appointment;

import com.clinexa.appointment.dto.AppointmentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    @PostMapping
    @PreAuthorize("hasAnyAuthority('PATIENT','RECEPTIONIST','ADMIN')")
    public Appointment book(
            @RequestBody AppointmentRequest req,
            Authentication authentication
    ) {

        // ✅ Logged-in user's email from JWT
        String email = authentication.getName();

        return service.book(email, req);
    }
}