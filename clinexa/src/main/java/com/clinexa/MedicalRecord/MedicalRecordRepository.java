package com.clinexa.MedicalRecord;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MedicalRecordRepository
        extends JpaRepository<MedicalRecord, Long> {

    Optional<MedicalRecord> findByAppointmentId(
            Long appointmentId
    );

    List<MedicalRecord>
    findByAppointmentPatientEmailIgnoreCaseOrderByAppointmentAppointmentDateDesc(
            String patientEmail
    );
}