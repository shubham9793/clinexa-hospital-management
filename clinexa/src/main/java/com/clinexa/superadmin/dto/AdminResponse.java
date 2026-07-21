package com.clinexa.superadmin.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AdminResponse {

    private Long id;
    private String name;
    private String email;
    private String phone;
    private boolean enabled;
}