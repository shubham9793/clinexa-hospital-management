package com.clinexa.MedicalRecord;

import com.clinexa.MedicalRecord.dto.MedicalRecordRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService service;

    @PutMapping("/{appointmentId}")
    @PreAuthorize("hasAuthority('DOCTOR')")
    public MedicalRecord saveMedicalRecord(
            @PathVariable Long appointmentId,
            @RequestBody MedicalRecordRequest request,
            Authentication authentication
    ) {

        return service.saveMedicalRecord(
                appointmentId,
                request,
                authentication.getName()
        );
    }

    @GetMapping("/{appointmentId}")
    @PreAuthorize(
            "hasAuthority('DOCTOR') or " +
                    "hasAuthority('PATIENT') or " +
                    "hasAuthority('RECEPTIONIST')"
    )
    public MedicalRecord getMedicalRecord(
            @PathVariable Long appointmentId
    ) {

        return service.getMedicalRecordByAppointment(
                appointmentId
        );
    }


    @GetMapping("/my")
    @PreAuthorize("hasAuthority('PATIENT')")
    public List<MedicalRecord> getMyMedicalHistory(
            Authentication authentication
    ) {
        return service.getMyMedicalHistory(authentication.getName());
    }
}