package com.clinexa.appointment;

import com.clinexa.User.User;
import com.clinexa.doctor.Doctor;
import com.clinexa.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    /*
     * ========================================
     * DOCTOR SLOT CHECKS
     * ========================================
     */

    boolean existsByDoctorAndAppointmentDateAndSlotTimeBetweenAndStatusIn(
            Doctor doctor,
            LocalDate appointmentDate,
            LocalTime startTime,
            LocalTime endTime,
            Collection<AppointmentStatus> statuses
    );

    boolean existsByDoctorAndAppointmentDateAndSlotTimeBetweenAndStatusInAndIdNot(
            Doctor doctor,
            LocalDate appointmentDate,
            LocalTime startTime,
            LocalTime endTime,
            Collection<AppointmentStatus> statuses,
            Long ignoredAppointmentId
    );

    /*
     * ========================================
     * REGISTERED PATIENT SLOT CHECKS
     * ========================================
     */

    boolean existsByPatientAndAppointmentDateAndSlotTimeBetweenAndStatusIn(
            User patient,
            LocalDate appointmentDate,
            LocalTime startTime,
            LocalTime endTime,
            Collection<AppointmentStatus> statuses
    );

    boolean existsByPatientAndAppointmentDateAndSlotTimeBetweenAndStatusInAndIdNot(
            User patient,
            LocalDate appointmentDate,
            LocalTime startTime,
            LocalTime endTime,
            Collection<AppointmentStatus> statuses,
            Long ignoredAppointmentId
    );

    /*
     * ========================================
     * RECEPTIONIST-MANAGED PATIENT SLOT CHECKS
     * ========================================
     */

    boolean existsByPatientRecordAndAppointmentDateAndSlotTimeBetweenAndStatusIn(
            Patient patientRecord,
            LocalDate appointmentDate,
            LocalTime startTime,
            LocalTime endTime,
            Collection<AppointmentStatus> statuses
    );

    boolean existsByPatientRecordAndAppointmentDateAndSlotTimeBetweenAndStatusInAndIdNot(
            Patient patientRecord,
            LocalDate appointmentDate,
            LocalTime startTime,
            LocalTime endTime,
            Collection<AppointmentStatus> statuses,
            Long ignoredAppointmentId
    );

    List<Appointment> findByPatientOrderByAppointmentDateDescSlotTimeDesc(
            User patient
    );

    List<Appointment> findByDoctorEmailIgnoreCaseOrderByAppointmentDateDescSlotTimeDesc(
            String doctorEmail
    );

    List<Appointment> findAllByOrderByAppointmentDateDescSlotTimeDesc();
}