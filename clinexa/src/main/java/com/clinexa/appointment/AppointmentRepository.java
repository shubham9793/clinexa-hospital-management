package com.clinexa.appointment;

import com.clinexa.doctor.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    boolean existsByDoctorAndAppointmentDateAndSlotTimeBetween(
            Doctor doctor,
            LocalDate appointmentDate,
            LocalTime start,
            LocalTime end
    );
}