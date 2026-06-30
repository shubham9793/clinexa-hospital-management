package com.clinexa.doctor.dto;

import lombok.Data;

@Data
public class DoctorRequest {

    private String name;
    private String email;
    private String phone;

    private boolean active;

    private Long departmentId;
    private Long categoryId;
    private String password;
}