package com.clinexa.patient.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientRegisterRequest {

    private String name;

    private String email;

    private String phone;

    private String password;

    private String gender;

    private LocalDate dob;

    private String address;
}