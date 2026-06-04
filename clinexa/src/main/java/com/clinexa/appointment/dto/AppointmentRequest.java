package com.clinexa.appointment.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class AppointmentRequest {

    private Long doctorId;

    private String patientName;

    private Integer age;

    private String gender;

    private String phone;

    private String description;

    private LocalDate appointmentDate;

    private LocalTime slotTime;
}