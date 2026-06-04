package com.clinexa.department;

import com.clinexa.department.dto.DepartmentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService service;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public Department create(@RequestBody DepartmentRequest req) {
        return service.create(req);
    }

    @GetMapping
    public List<Department> getAll() {
        return service.getAll();
    }

    @GetMapping("/count")
    public long getDepartmentCount() {

        return service
                .getDepartmentCount();
    }
}