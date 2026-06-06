package com.clinexa.appointment.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class AppointmentRescheduleRequest {

    /*
     * Receptionist or Patient may select a different doctor.
     * Use the current doctor ID when only changing the time.
     */
    private Long doctorId;

    private LocalDate appointmentDate;

    private LocalTime slotTime;
}