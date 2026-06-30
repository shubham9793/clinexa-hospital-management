package com.clinexa.MedicalRecord;

import com.clinexa.appointment.Appointment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "appointment_id", unique = true)
    @JsonIgnore
    private Appointment appointment;

    private String diagnosis;

    @Column(length = 3000)
    private String doctorNotes;

    @Column(length = 3000)
    private String prescription;

    private LocalDate followUpDate;

    private LocalDate createdDate;

    private LocalDate updatedDate;
}