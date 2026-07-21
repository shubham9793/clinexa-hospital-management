package com.clinexa.superadmin.dto;

import lombok.Data;

@Data
public class AdminCreateRequest {

    private String name;

    private String email;

    private String phone;

    private String password;
}