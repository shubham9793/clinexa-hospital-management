package com.clinexa.MedicalRecord;

import com.clinexa.MedicalRecord.dto.MedicalRecordRequest;
import com.clinexa.appointment.Appointment;
import com.clinexa.appointment.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;

    public MedicalRecord saveMedicalRecord(
            Long appointmentId,
            MedicalRecordRequest request,
            String loggedInDoctorEmail
    ) {

        Appointment appointment =
                appointmentRepository.findById(appointmentId)
                        .orElseThrow(() ->
                                new RuntimeException("Appointment not found")
                        );

        if (
                appointment.getDoctor() == null ||
                        appointment.getDoctor().getEmail() == null ||
                        !appointment.getDoctor().getEmail()
                                .equalsIgnoreCase(loggedInDoctorEmail)
        ) {
            throw new RuntimeException(
                    "You can update only your own appointment"
            );
        }

        MedicalRecord record =
                medicalRecordRepository
                        .findByAppointmentId(appointmentId)
                        .orElse(
                                MedicalRecord.builder()
                                        .appointment(appointment)
                                        .createdDate(LocalDate.now())
                                        .build()
                        );

        record.setDiagnosis(request.getDiagnosis());
        record.setDoctorNotes(request.getDoctorNotes());
        record.setPrescription(request.getPrescription());
        record.setFollowUpDate(request.getFollowUpDate());
        record.setUpdatedDate(LocalDate.now());

        return medicalRecordRepository.save(record);
    }

    public MedicalRecord getMedicalRecordByAppointment(
            Long appointmentId
    ) {
        return medicalRecordRepository
                .findByAppointmentId(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException("Medical record not found")
                );
    }


    public List<MedicalRecord> getMyMedicalHistory(
            String loggedInPatientEmail
    ) {
        return medicalRecordRepository
                .findByAppointmentPatientEmailIgnoreCaseOrderByAppointmentAppointmentDateDesc(
                        loggedInPatientEmail
                );
    }
}