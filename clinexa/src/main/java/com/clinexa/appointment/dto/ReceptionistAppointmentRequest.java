package com.clinexa.appointment.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ReceptionistAppointmentRequest {

    /*
     * Patient record selected by Receptionist
     * from the Manage Patients page.
     */
    private Long patientId;

    private Long doctorId;

    private String description;

    private LocalDate appointmentDate;

    private LocalTime slotTime;
}