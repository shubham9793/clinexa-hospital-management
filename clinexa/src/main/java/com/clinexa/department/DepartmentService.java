package com.clinexa.department;

import com.clinexa.department.dto.DepartmentRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository repo;

    public Department create(DepartmentRequest req) {

        if (repo.existsByName(req.getName())) {
            throw new RuntimeException("Department already exists with this name");
        }

        Department d = Department.builder()
                .name(req.getName())
                .description(req.getDescription())
                .build();

        return repo.save(d);
    }

    public List<Department> getAll() {
        return repo.findAll();
    }


    public long getDepartmentCount() {

        return repo.count();
    }


    public Department getById(Long id) {

        return repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Department not found"
                        )
                );
    }

    public void delete(Long id) {

        repo.deleteById(id);
    }

    public Department update(
            Long id,
            DepartmentRequest request
    ) {

        Department department =
                repo.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Department not found"
                                ));

        department.setName(
                request.getName()
        );

        department.setDescription(
                request.getDescription()
        );

        return repo.save(
                department
        );
    }

}