package com.clinexa.activity.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ActivityDto {

    private String type;
    private String message;
    private LocalDateTime createdAt;

}