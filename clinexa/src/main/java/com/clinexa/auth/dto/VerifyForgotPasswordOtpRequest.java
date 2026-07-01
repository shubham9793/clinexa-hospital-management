package com.clinexa.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VerifyForgotPasswordOtpRequest {

    private String email;

    private String otp;

}