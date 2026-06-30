package com.clinexa.MedicalRecord.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MedicalRecordRequest {

    private String diagnosis;

    private String doctorNotes;

    private String prescription;

    private LocalDate followUpDate;
}