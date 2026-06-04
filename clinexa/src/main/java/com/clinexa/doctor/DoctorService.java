package com.clinexa.doctor;

import com.clinexa.department.Department;
import com.clinexa.department.DepartmentRepository;
import com.clinexa.doctor.dto.DoctorRequest;
import com.clinexa.doctorcategory.DoctorCategory;
import com.clinexa.doctorcategory.DoctorCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;
    private final DoctorCategoryRepository categoryRepository;

    public Doctor create(DoctorRequest req) {

        if (doctorRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Doctor already exists with this email");
        }

        Department dept = departmentRepository.findById(req.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        DoctorCategory cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Doctor doctor = Doctor.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .active(req.isActive())
                .department(dept)
                .category(cat)
                .build();

        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAll() {
        return doctorRepository.findAll();
    }

    public Doctor getById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public void delete(Long id) {

        doctorRepository.deleteById(id);
    }
    public Doctor getDoctorById(
            Long id
    ) {

        return doctorRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        )
                );
    }


    public Doctor updateDoctor(
            Long id,
            DoctorRequest req
    ) {

        Doctor doctor =
                doctorRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                )
                        );

        Department department =
                departmentRepository.findById(
                        req.getDepartmentId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"
                        )
                );

        DoctorCategory category =
                categoryRepository.findById(
                        req.getCategoryId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Category not found"
                        )
                );

        doctor.setName(req.getName());

        doctor.setEmail(req.getEmail());

        doctor.setPhone(req.getPhone());

        doctor.setDepartment(department);

        doctor.setCategory(category);

        return doctorRepository.save(doctor);
    }


    public Doctor toggleAvailability(Long id) {

        Doctor doctor =
                doctorRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Doctor not found"
                                )
                        );

        doctor.setActive(
                !doctor.isActive()
        );

        return doctorRepository.save(doctor);
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
}