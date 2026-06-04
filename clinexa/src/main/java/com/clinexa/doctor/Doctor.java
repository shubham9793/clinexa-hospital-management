package com.clinexa.doctor;

import com.clinexa.department.Department;
import com.clinexa.doctorcategory.DoctorCategory;
import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.PrePersist;


import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String email;

    private String phone;


    @Column(nullable = false)
    private boolean active = true;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private DoctorCategory category;


    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}