package com.clinexa.appointment;

import com.clinexa.appointment.dto.AppointmentRequest;
import com.clinexa.appointment.dto.AppointmentRescheduleRequest;
import com.clinexa.appointment.dto.ReceptionistAppointmentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    @PostMapping("/my")
    @PreAuthorize("hasAuthority('PATIENT')")
    public Appointment bookOwnAppointment(
            @RequestBody AppointmentRequest request,
            Authentication authentication
    ) {
        return service.bookOwnAppointment(
                authentication.getName(),
                request
        );
    }

    @PostMapping("/receptionist")
    @PreAuthorize("hasAuthority('RECEPTIONIST')")
    public Appointment bookByReceptionist(
            @RequestBody ReceptionistAppointmentRequest request
    ) {
        return service.bookByReceptionist(request);
    }

    @PutMapping("/{id}/doctor-status")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public Appointment updateStatusByDoctor(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status,
            Authentication authentication
    ) {
        return service.updateStatusByDoctor(
                id,
                status,
                authentication.getName()
        );
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('RECEPTIONIST')")
    public Appointment cancelAppointment(
            @PathVariable Long id
    ) {
        return service.cancelAppointment(id);
    }

    @PutMapping("/my/{id}/cancel")
    @PreAuthorize("hasAuthority('PATIENT')")
    public Appointment cancelOwnAppointment(
            @PathVariable Long id,
            Authentication authentication
    ) {
        return service.cancelOwnAppointment(
                id,
                authentication.getName()
        );
    }

    @PutMapping("/{id}/reschedule")
    @PreAuthorize("hasAuthority('RECEPTIONIST')")
    public Appointment rescheduleByReceptionist(
            @PathVariable Long id,
            @RequestBody AppointmentRescheduleRequest request
    ) {
        return service.rescheduleByReceptionist(
                id,
                request
        );
    }

    @PutMapping("/my/{id}/reschedule")
    @PreAuthorize("hasAuthority('PATIENT')")
    public Appointment rescheduleOwnAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentRescheduleRequest request,
            Authentication authentication
    ) {
        return service.rescheduleOwnAppointment(
                id,
                authentication.getName(),
                request
        );
    }

    @GetMapping("/my")
    @PreAuthorize("hasAuthority('PATIENT')")
    public List<Appointment> getOwnAppointments(
            Authentication authentication
    ) {
        return service.getOwnAppointments(
                authentication.getName()
        );
    }

    @GetMapping("/doctor/my")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public List<Appointment> getDoctorAppointments(
            Authentication authentication
    ) {
        return service.getDoctorAppointments(
                authentication.getName()
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize(
            "hasAuthority('DOCTOR') or hasAuthority('PATIENT') or hasAuthority('RECEPTIONIST')"
    )
    public Appointment getAppointment(
            @PathVariable Long id
    ) {
        return service.getAppointment(id);
    }

    @GetMapping("/receptionist/all")
    @PreAuthorize("hasAuthority('RECEPTIONIST')")
    public List<Appointment> getAllAppointmentsForReceptionist() {
        return service.getAllAppointmentsForReceptionist();
    }

}