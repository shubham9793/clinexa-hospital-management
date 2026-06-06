package com.clinexa.appointment;

import com.clinexa.appointment.dto.AppointmentRequest;
import com.clinexa.appointment.dto.AppointmentRescheduleRequest;
import com.clinexa.appointment.dto.ReceptionistAppointmentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    /*
     * ========================================
     * PATIENT SELF-BOOKING
     * ========================================
     *
     * POST /appointments/my
     */
    @PostMapping("/my")
    @PreAuthorize("hasAuthority('PATIENT')")
    public Appointment bookOwnAppointment(
            @RequestBody AppointmentRequest request,
            Authentication authentication
    ) {

        String loggedInPatientEmail =
                authentication.getName();

        return service.bookOwnAppointment(
                loggedInPatientEmail,
                request
        );
    }

    /*
     * ========================================
     * RECEPTIONIST BOOKING
     * ========================================
     *
     * POST /appointments/receptionist
     */
    @PostMapping("/receptionist")
    @PreAuthorize("hasAuthority('RECEPTIONIST')")
    public Appointment bookByReceptionist(
            @RequestBody ReceptionistAppointmentRequest request
    ) {

        return service.bookByReceptionist(request);
    }

    /*
     * ========================================
     * DOCTOR STATUS UPDATE
     * ========================================
     *
     * PUT /appointments/4/doctor-status?status=CONFIRMED
     */
    @PutMapping("/{id}/doctor-status")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public Appointment updateStatusByDoctor(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status,
            Authentication authentication
    ) {

        String loggedInDoctorEmail =
                authentication.getName();

        return service.updateStatusByDoctor(
                id,
                status,
                loggedInDoctorEmail
        );
    }

    /*
     * ========================================
     * RECEPTIONIST CANCELLATION
     * ========================================
     *
     * PUT /appointments/4/cancel
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('RECEPTIONIST')")
    public Appointment cancelAppointment(
            @PathVariable Long id
    ) {

        return service.cancelAppointment(id);
    }

    /*
     * ========================================
     * PATIENT CANCELLATION
     * ========================================
     *
     * PUT /appointments/my/4/cancel
     */
    @PutMapping("/my/{id}/cancel")
    @PreAuthorize("hasAuthority('PATIENT')")
    public Appointment cancelOwnAppointment(
            @PathVariable Long id,
            Authentication authentication
    ) {

        String loggedInPatientEmail =
                authentication.getName();

        return service.cancelOwnAppointment(
                id,
                loggedInPatientEmail
        );
    }

    /*
     * ========================================
     * RECEPTIONIST RESCHEDULING
     * ========================================
     *
     * PUT /appointments/4/reschedule
     */
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

    /*
     * ========================================
     * PATIENT RESCHEDULING
     * ========================================
     *
     * PUT /appointments/my/4/reschedule
     */
    @PutMapping("/my/{id}/reschedule")
    @PreAuthorize("hasAuthority('PATIENT')")
    public Appointment rescheduleOwnAppointment(
            @PathVariable Long id,
            @RequestBody AppointmentRescheduleRequest request,
            Authentication authentication
    ) {

        String loggedInPatientEmail =
                authentication.getName();

        return service.rescheduleOwnAppointment(
                id,
                loggedInPatientEmail,
                request
        );
    }
}