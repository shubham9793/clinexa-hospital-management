package com.clinexa.appointment;

import com.clinexa.User.User;
import com.clinexa.doctor.Doctor;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User patient;

    @ManyToOne
    private Doctor doctor;

    private String patientName;

    private Integer age;

    private String gender;

    private String phone;

    private String description;

    private LocalDate appointmentDate;

    private LocalTime slotTime;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;
}