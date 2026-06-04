package com.clinexa.appointment;

import com.clinexa.User.User;
import com.clinexa.User.UserRepository;
import com.clinexa.appointment.dto.AppointmentRequest;
import com.clinexa.doctor.Doctor;
import com.clinexa.doctor.DoctorRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repo;
    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;


    public Appointment book(String patientEmail, AppointmentRequest req) {

        User patient = userRepo.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepo.findById(req.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        // ✅ Check slot already booked or not
        LocalTime requestedTime = req.getSlotTime();

        // 15 minute protection window
        LocalTime startWindow = requestedTime.minusMinutes(14);
        LocalTime endWindow = requestedTime.plusMinutes(14);

        boolean alreadyBooked =
                repo.existsByDoctorAndAppointmentDateAndSlotTimeBetween(
                        doctor,
                        req.getAppointmentDate(),
                        startWindow,
                        endWindow
                );

        if (alreadyBooked) {
            throw new RuntimeException(
                    "Doctor already has appointment near this time slot"
            );
        }

        // ✅ Create appointment
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)

                .patientName(req.getPatientName())
                .age(req.getAge())
                .gender(req.getGender())
                .phone(req.getPhone())
                .description(req.getDescription())

                .appointmentDate(req.getAppointmentDate())
                .slotTime(req.getSlotTime())

                .status(AppointmentStatus.PENDING)
                .build();

        return repo.save(appointment);
    }
}