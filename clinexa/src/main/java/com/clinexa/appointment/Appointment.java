package com.clinexa.appointment;

import com.clinexa.MedicalRecord.MedicalRecord;
import com.clinexa.User.User;
import com.clinexa.doctor.Doctor;
import com.clinexa.patient.Patient;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    /*
     * Used when a registered Patient books their own appointment.
     * This account comes from the users table.
     */
    @ManyToOne
    @JoinColumn(name = "patient_user_id")
    private User patient;

    /*
     * Used when a Receptionist books an appointment
     * for a Patient record from the patient table.
     */
    @ManyToOne
    @JoinColumn(name = "patient_record_id")
    private Patient patientRecord;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private String patientName;

    private Integer age;

    private String gender;

    private String phone;

    private String description;

    private LocalDate appointmentDate;

    private LocalTime slotTime;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private LocalDate completedDate;

    @OneToOne(mappedBy = "appointment")
    @JsonIgnore
    private MedicalRecord medicalRecord;
}