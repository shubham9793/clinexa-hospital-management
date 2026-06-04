package com.clinexa.doctorcategory;

import com.clinexa.doctorcategory.dto.DoctorCategoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctor-categories")
@RequiredArgsConstructor
public class DoctorCategoryController {

    private final DoctorCategoryService service;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public DoctorCategory create(
            @RequestBody DoctorCategoryRequest req
    ) {
        return service.create(req);
    }

    @GetMapping("/all")
    public List<DoctorCategory> getAll() {
        return service.getAll();
    }


    @GetMapping("/count")
    public long getCategoryCount() {

        return service.getCategoryCount();
    }
}