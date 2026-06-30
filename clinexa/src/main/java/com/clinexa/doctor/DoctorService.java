package com.clinexa.doctor;

import com.clinexa.User.User;
import com.clinexa.User.UserRepository;
import com.clinexa.department.Department;
import com.clinexa.department.DepartmentRepository;
import com.clinexa.doctor.dto.DoctorRequest;
import com.clinexa.doctorcategory.DoctorCategory;
import com.clinexa.doctorcategory.DoctorCategoryRepository;
import com.clinexa.role.Role;
import com.clinexa.role.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorCategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public Doctor create(DoctorRequest req) {

        validateDoctorRequest(req, true);

        String email = normalizeEmail(req.getEmail());

        if (doctorRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Doctor already exists with this email");
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new RuntimeException("Login account already exists with this email");
        }

        Department department = departmentRepository
                .findById(req.getDepartmentId())
                .orElseThrow(() ->
                        new RuntimeException("Department not found")
                );

        DoctorCategory category = categoryRepository
                .findById(req.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found")
                );

        Role doctorRole = roleRepository
                .findByName("DOCTOR")
                .orElseThrow(() ->
                        new RuntimeException("DOCTOR role not found")
                );

        Doctor doctor = Doctor.builder()
                .name(req.getName().trim())
                .email(email)
                .phone(req.getPhone().trim())
                .active(req.isActive())
                .department(department)
                .category(category)
                .build();

        Doctor savedDoctor = doctorRepository.save(doctor);

        User user = User.builder()
                .name(req.getName().trim())
                .email(email)
                .phone(req.getPhone().trim())
                .password(passwordEncoder.encode(req.getPassword()))
                .role(doctorRole)
                .enabled(req.isActive())
                .build();

        userRepository.save(user);

        return savedDoctor;
    }

    public List<Doctor> getAll() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {

        return doctorRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );
    }

    @Transactional
    public Doctor updateDoctor(
            Long id,
            DoctorRequest req
    ) {

        validateDoctorRequest(req, false);

        Doctor doctor = doctorRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        String oldEmail = doctor.getEmail();
        String newEmail = normalizeEmail(req.getEmail());

        if (!oldEmail.equalsIgnoreCase(newEmail)) {

            if (doctorRepository.existsByEmailIgnoreCase(newEmail)) {
                throw new RuntimeException("Doctor already exists with this email");
            }

            if (userRepository.existsByEmailIgnoreCase(newEmail)) {
                throw new RuntimeException("Login account already exists with this email");
            }
        }

        Department department = departmentRepository
                .findById(req.getDepartmentId())
                .orElseThrow(() ->
                        new RuntimeException("Department not found")
                );

        DoctorCategory category = categoryRepository
                .findById(req.getCategoryId())
                .orElseThrow(() ->
                        new RuntimeException("Category not found")
                );

        doctor.setName(req.getName().trim());
        doctor.setEmail(newEmail);
        doctor.setPhone(req.getPhone().trim());
        doctor.setDepartment(department);
        doctor.setCategory(category);
        doctor.setActive(req.isActive());

        Doctor savedDoctor = doctorRepository.save(doctor);

        User user = userRepository
                .findByEmailIgnoreCase(oldEmail)
                .orElseThrow(() ->
                        new RuntimeException("Doctor login account not found")
                );

        user.setName(req.getName().trim());
        user.setEmail(newEmail);
        user.setPhone(req.getPhone().trim());
        user.setEnabled(req.isActive());

        if (
                req.getPassword() != null
                        && !req.getPassword().isBlank()
        ) {

            if (req.getPassword().length() < 6) {
                throw new RuntimeException(
                        "Password must contain at least 6 characters"
                );
            }

            user.setPassword(
                    passwordEncoder.encode(req.getPassword())
            );
        }

        userRepository.save(user);

        return savedDoctor;
    }

    @Transactional
    public void delete(Long id) {

        Doctor doctor = doctorRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        User user = userRepository
                .findByEmailIgnoreCase(doctor.getEmail())
                .orElse(null);

        doctorRepository.delete(doctor);

        if (user != null) {
            userRepository.delete(user);
        }
    }

    @Transactional
    public Doctor toggleAvailability(Long id) {

        Doctor doctor = doctorRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found")
                );

        doctor.setActive(!doctor.isActive());

        Doctor savedDoctor = doctorRepository.save(doctor);

        User user = userRepository
                .findByEmailIgnoreCase(doctor.getEmail())
                .orElse(null);

        if (user != null) {
            user.setEnabled(doctor.isActive());
            userRepository.save(user);
        }

        return savedDoctor;
    }

    public long getDoctorCount() {
        return doctorRepository.count();
    }

    public long getActiveDoctorCount() {
        return doctorRepository.countByActiveTrue();
    }

    public long getInactiveDoctorCount() {
        return doctorRepository.countByActiveFalse();
    }

    private void validateDoctorRequest(
            DoctorRequest req,
            boolean passwordRequired
    ) {

        if (req == null) {
            throw new RuntimeException("Doctor details are required");
        }

        if (req.getName() == null || req.getName().isBlank()) {
            throw new RuntimeException("Doctor name is required");
        }

        if (req.getEmail() == null || req.getEmail().isBlank()) {
            throw new RuntimeException("Doctor email is required");
        }

        if (req.getPhone() == null || req.getPhone().isBlank()) {
            throw new RuntimeException("Doctor phone is required");
        }

        if (req.getDepartmentId() == null) {
            throw new RuntimeException("Department is required");
        }

        if (req.getCategoryId() == null) {
            throw new RuntimeException("Category is required");
        }

        if (passwordRequired) {

            if (req.getPassword() == null || req.getPassword().isBlank()) {
                throw new RuntimeException("Doctor password is required");
            }

            if (req.getPassword().length() < 6) {
                throw new RuntimeException(
                        "Password must contain at least 6 characters"
                );
            }
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}