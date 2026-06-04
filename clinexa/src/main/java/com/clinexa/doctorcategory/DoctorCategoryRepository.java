package com.clinexa.doctorcategory;

import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorCategoryRepository extends JpaRepository<DoctorCategory, Long> {

    boolean existsByName(String name);


}