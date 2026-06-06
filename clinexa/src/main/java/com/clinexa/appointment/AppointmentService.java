package com.clinexa.appointment;

import com.clinexa.User.User;
import com.clinexa.User.UserRepository;
import com.clinexa.appointment.dto.AppointmentRequest;
import com.clinexa.appointment.dto.AppointmentRescheduleRequest;
import com.clinexa.appointment.dto.ReceptionistAppointmentRequest;
import com.clinexa.doctor.Doctor;
import com.clinexa.doctor.DoctorRepository;
import com.clinexa.patient.Patient;
import com.clinexa.patient.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Period;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    /*
     * Only these statuses block a time slot.
     *
     * CANCELLED does not block a slot because somebody else
     * should be able to book it again.
     */
    private static final List<AppointmentStatus> BLOCKING_STATUSES =
            List.of(
                    AppointmentStatus.PENDING,
                    AppointmentStatus.CONFIRMED
            );

    private final AppointmentRepository repo;
    private final DoctorRepository doctorRepo;
    private final UserRepository userRepo;
    private final PatientRepository patientRepo;

    /*
     * ========================================
     * PATIENT SELF-BOOKING
     * ========================================
     */

    public Appointment bookOwnAppointment(
            String loggedInPatientEmail,
            AppointmentRequest req
    ) {

        validateBasicBookingRequest(
                req.getDoctorId(),
                req.getAppointmentDate(),
                req.getSlotTime()
        );

        User patientUser = userRepo
                .findByEmailIgnoreCase(loggedInPatientEmail)
                .orElseThrow(() ->
                        new RuntimeException("Patient account not found")
                );

        Doctor doctor =
                findActiveDoctor(req.getDoctorId());

        validateSlotAvailability(
                doctor,
                patientUser,
                null,
                req.getAppointmentDate(),
                req.getSlotTime(),
                null
        );

        Appointment appointment = Appointment
                .builder()
                .patient(patientUser)
                .patientRecord(null)
                .doctor(doctor)
                .patientName(
                        firstNonBlank(
                                req.getPatientName(),
                                patientUser.getName()
                        )
                )
                .age(req.getAge())
                .gender(req.getGender())
                .phone(
                        firstNonBlank(
                                req.getPhone(),
                                patientUser.getPhone()
                        )
                )
                .description(req.getDescription())
                .appointmentDate(req.getAppointmentDate())
                .slotTime(req.getSlotTime())
                .status(AppointmentStatus.PENDING)
                .build();

        return repo.save(appointment);
    }

    /*
     * ========================================
     * RECEPTIONIST BOOKING
     * ========================================
     */

    public Appointment bookByReceptionist(
            ReceptionistAppointmentRequest req
    ) {

        if (req == null) {
            throw new RuntimeException(
                    "Appointment request is required"
            );
        }

        if (req.getPatientId() == null) {
            throw new RuntimeException(
                    "Patient ID is required"
            );
        }

        validateBasicBookingRequest(
                req.getDoctorId(),
                req.getAppointmentDate(),
                req.getSlotTime()
        );

        Patient patientRecord = patientRepo
                .findById(req.getPatientId())
                .orElseThrow(() ->
                        new RuntimeException("Patient record not found")
                );

        if (!patientRecord.isActive()) {
            throw new RuntimeException(
                    "Inactive patient cannot book an appointment"
            );
        }

        Doctor doctor =
                findActiveDoctor(req.getDoctorId());

        validateSlotAvailability(
                doctor,
                null,
                patientRecord,
                req.getAppointmentDate(),
                req.getSlotTime(),
                null
        );

        Appointment appointment = Appointment
                .builder()
                .patient(null)
                .patientRecord(patientRecord)
                .doctor(doctor)
                .patientName(patientRecord.getName())
                .age(calculateAge(patientRecord.getDob()))
                .gender(patientRecord.getGender())
                .phone(patientRecord.getPhone())
                .description(req.getDescription())
                .appointmentDate(req.getAppointmentDate())
                .slotTime(req.getSlotTime())
                .status(AppointmentStatus.PENDING)
                .build();

        return repo.save(appointment);
    }

    /*
     * ========================================
     * DOCTOR STATUS UPDATE
     * ========================================
     */

    public Appointment updateStatusByDoctor(
            Long appointmentId,
            AppointmentStatus newStatus,
            String loggedInDoctorEmail
    ) {

        Appointment appointment =
                findAppointmentById(appointmentId);

        String assignedDoctorEmail =
                appointment.getDoctor().getEmail();

        if (
                assignedDoctorEmail == null
                        || !assignedDoctorEmail.equalsIgnoreCase(
                        loggedInDoctorEmail
                )
        ) {

            throw new RuntimeException(
                    "You can update only your own appointments"
            );
        }

        validateStatusTransition(
                appointment.getStatus(),
                newStatus
        );

        appointment.setStatus(newStatus);

        return repo.save(appointment);
    }

    /*
     * ========================================
     * RECEPTIONIST CANCELLATION
     * ========================================
     */

    public Appointment cancelAppointment(
            Long appointmentId
    ) {

        Appointment appointment =
                findAppointmentById(appointmentId);

        validateStatusTransition(
                appointment.getStatus(),
                AppointmentStatus.CANCELLED
        );

        appointment.setStatus(
                AppointmentStatus.CANCELLED
        );

        return repo.save(appointment);
    }

    /*
     * ========================================
     * PATIENT CANCELLATION
     * ========================================
     */

    public Appointment cancelOwnAppointment(
            Long appointmentId,
            String loggedInPatientEmail
    ) {

        Appointment appointment =
                findAppointmentById(appointmentId);

        validatePatientOwnership(
                appointment,
                loggedInPatientEmail
        );

        return cancelAppointment(appointmentId);
    }

    /*
     * ========================================
     * RECEPTIONIST RESCHEDULING
     * ========================================
     */

    public Appointment rescheduleByReceptionist(
            Long appointmentId,
            AppointmentRescheduleRequest req
    ) {

        Appointment appointment =
                findAppointmentById(appointmentId);

        validateAppointmentCanBeRescheduled(
                appointment
        );

        validateBasicBookingRequest(
                req.getDoctorId(),
                req.getAppointmentDate(),
                req.getSlotTime()
        );

        Doctor doctor =
                findActiveDoctor(req.getDoctorId());

        validateSlotAvailability(
                doctor,
                appointment.getPatient(),
                appointment.getPatientRecord(),
                req.getAppointmentDate(),
                req.getSlotTime(),
                appointment.getId()
        );

        updateRescheduledAppointment(
                appointment,
                doctor,
                req
        );

        return repo.save(appointment);
    }

    /*
     * ========================================
     * PATIENT RESCHEDULING
     * ========================================
     */

    public Appointment rescheduleOwnAppointment(
            Long appointmentId,
            String loggedInPatientEmail,
            AppointmentRescheduleRequest req
    ) {

        Appointment appointment =
                findAppointmentById(appointmentId);

        validatePatientOwnership(
                appointment,
                loggedInPatientEmail
        );

        validateAppointmentCanBeRescheduled(
                appointment
        );

        validateBasicBookingRequest(
                req.getDoctorId(),
                req.getAppointmentDate(),
                req.getSlotTime()
        );

        Doctor doctor =
                findActiveDoctor(req.getDoctorId());

        validateSlotAvailability(
                doctor,
                appointment.getPatient(),
                appointment.getPatientRecord(),
                req.getAppointmentDate(),
                req.getSlotTime(),
                appointment.getId()
        );

        updateRescheduledAppointment(
                appointment,
                doctor,
                req
        );

        return repo.save(appointment);
    }

    /*
     * ========================================
     * COMMON HELPERS
     * ========================================
     */

    private Appointment findAppointmentById(
            Long appointmentId
    ) {

        return repo
                .findById(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException("Appointment not found")
                );
    }

    private Doctor findActiveDoctor(
            Long doctorId
    ) {

        Doctor doctor = doctorRepo
                .findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        if (!doctor.isActive()) {
            throw new RuntimeException(
                    "Doctor is currently unavailable"
            );
        }

        return doctor;
    }

    private void validateBasicBookingRequest(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime slotTime
    ) {

        if (doctorId == null) {
            throw new RuntimeException(
                    "Doctor ID is required"
            );
        }

        if (appointmentDate == null) {
            throw new RuntimeException(
                    "Appointment date is required"
            );
        }

        if (slotTime == null) {
            throw new RuntimeException(
                    "Appointment time is required"
            );
        }

        LocalDate today = LocalDate.now();
        LocalTime currentTime = LocalTime.now();

        if (appointmentDate.isBefore(today)) {
            throw new RuntimeException(
                    "Past appointment date is not allowed"
            );
        }

        if (
                appointmentDate.isEqual(today)
                        && slotTime.isBefore(currentTime)
        ) {

            throw new RuntimeException(
                    "Past appointment time is not allowed"
            );
        }
    }

    private void validateSlotAvailability(
            Doctor doctor,
            User patientUser,
            Patient patientRecord,
            LocalDate appointmentDate,
            LocalTime requestedTime,
            Long ignoredAppointmentId
    ) {

        LocalTime startWindow =
                requestedTime.minusMinutes(14);

        LocalTime endWindow =
                requestedTime.plusMinutes(14);

        boolean doctorAlreadyBooked;

        if (ignoredAppointmentId == null) {

            doctorAlreadyBooked =
                    repo.existsByDoctorAndAppointmentDateAndSlotTimeBetweenAndStatusIn(
                            doctor,
                            appointmentDate,
                            startWindow,
                            endWindow,
                            BLOCKING_STATUSES
                    );

        } else {

            doctorAlreadyBooked =
                    repo.existsByDoctorAndAppointmentDateAndSlotTimeBetweenAndStatusInAndIdNot(
                            doctor,
                            appointmentDate,
                            startWindow,
                            endWindow,
                            BLOCKING_STATUSES,
                            ignoredAppointmentId
                    );
        }

        if (doctorAlreadyBooked) {
            throw new RuntimeException(
                    "Doctor already has an appointment near this time slot"
            );
        }

        if (patientUser != null) {

            boolean patientAlreadyBooked;

            if (ignoredAppointmentId == null) {

                patientAlreadyBooked =
                        repo.existsByPatientAndAppointmentDateAndSlotTimeBetweenAndStatusIn(
                                patientUser,
                                appointmentDate,
                                startWindow,
                                endWindow,
                                BLOCKING_STATUSES
                        );

            } else {

                patientAlreadyBooked =
                        repo.existsByPatientAndAppointmentDateAndSlotTimeBetweenAndStatusInAndIdNot(
                                patientUser,
                                appointmentDate,
                                startWindow,
                                endWindow,
                                BLOCKING_STATUSES,
                                ignoredAppointmentId
                        );
            }

            if (patientAlreadyBooked) {
                throw new RuntimeException(
                        "Patient already has another appointment near this time slot"
                );
            }
        }

        if (patientRecord != null) {

            boolean patientAlreadyBooked;

            if (ignoredAppointmentId == null) {

                patientAlreadyBooked =
                        repo.existsByPatientRecordAndAppointmentDateAndSlotTimeBetweenAndStatusIn(
                                patientRecord,
                                appointmentDate,
                                startWindow,
                                endWindow,
                                BLOCKING_STATUSES
                        );

            } else {

                patientAlreadyBooked =
                        repo.existsByPatientRecordAndAppointmentDateAndSlotTimeBetweenAndStatusInAndIdNot(
                                patientRecord,
                                appointmentDate,
                                startWindow,
                                endWindow,
                                BLOCKING_STATUSES,
                                ignoredAppointmentId
                        );
            }

            if (patientAlreadyBooked) {
                throw new RuntimeException(
                        "Patient already has another appointment near this time slot"
                );
            }
        }
    }

    private void validateAppointmentCanBeRescheduled(
            Appointment appointment
    ) {

        if (
                appointment.getStatus()
                        == AppointmentStatus.CANCELLED
        ) {

            throw new RuntimeException(
                    "Cancelled appointment cannot be rescheduled"
            );
        }

        if (
                appointment.getStatus()
                        == AppointmentStatus.COMPLETED
        ) {

            throw new RuntimeException(
                    "Completed appointment cannot be rescheduled"
            );
        }
    }

    private void updateRescheduledAppointment(
            Appointment appointment,
            Doctor doctor,
            AppointmentRescheduleRequest req
    ) {

        appointment.setDoctor(doctor);

        appointment.setAppointmentDate(
                req.getAppointmentDate()
        );

        appointment.setSlotTime(
                req.getSlotTime()
        );

        /*
         * Doctor must confirm the newly selected slot again.
         */
        appointment.setStatus(
                AppointmentStatus.PENDING
        );
    }

    private void validatePatientOwnership(
            Appointment appointment,
            String loggedInPatientEmail
    ) {

        boolean ownsThroughUserAccount =
                appointment.getPatient() != null
                        && appointment
                        .getPatient()
                        .getEmail()
                        .equalsIgnoreCase(
                                loggedInPatientEmail
                        );

        boolean ownsThroughPatientRecord =
                appointment.getPatientRecord() != null
                        && appointment
                        .getPatientRecord()
                        .getEmail() != null
                        && appointment
                        .getPatientRecord()
                        .getEmail()
                        .equalsIgnoreCase(
                                loggedInPatientEmail
                        );

        if (
                !ownsThroughUserAccount
                        && !ownsThroughPatientRecord
        ) {

            throw new RuntimeException(
                    "You can update only your own appointment"
            );
        }
    }

    private Integer calculateAge(
            LocalDate dob
    ) {

        if (dob == null) {
            return null;
        }

        return Period
                .between(
                        dob,
                        LocalDate.now()
                )
                .getYears();
    }

    private String firstNonBlank(
            String firstValue,
            String fallbackValue
    ) {

        if (
                firstValue != null
                        && !firstValue.isBlank()
        ) {

            return firstValue;
        }

        return fallbackValue;
    }

    private void validateStatusTransition(
            AppointmentStatus currentStatus,
            AppointmentStatus newStatus
    ) {

        if (newStatus == null) {
            throw new RuntimeException(
                    "New appointment status is required"
            );
        }

        if (currentStatus == newStatus) {
            throw new RuntimeException(
                    "Appointment already has status: "
                            + currentStatus
            );
        }

        if (currentStatus == AppointmentStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cancelled appointment cannot be updated"
            );
        }

        if (currentStatus == AppointmentStatus.COMPLETED) {
            throw new RuntimeException(
                    "Completed appointment cannot be updated"
            );
        }

        boolean validTransition =
                (
                        currentStatus == AppointmentStatus.PENDING
                                && (
                                newStatus
                                        == AppointmentStatus.CONFIRMED
                                        || newStatus
                                        == AppointmentStatus.CANCELLED
                        )
                )
                        ||
                        (
                                currentStatus
                                        == AppointmentStatus.CONFIRMED
                                        && (
                                        newStatus
                                                == AppointmentStatus.COMPLETED
                                                || newStatus
                                                == AppointmentStatus.CANCELLED
                                )
                        );

        if (!validTransition) {
            throw new RuntimeException(
                    "Invalid appointment status change: "
                            + currentStatus
                            + " to "
                            + newStatus
            );
        }
    }
}