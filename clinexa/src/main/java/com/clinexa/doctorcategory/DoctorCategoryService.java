package com.clinexa.doctorcategory;

import com.clinexa.doctorcategory.dto.DoctorCategoryRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorCategoryService {

    private final DoctorCategoryRepository repo;

    public DoctorCategory create(DoctorCategoryRequest req) {
        if(repo.existsByName(req.getName())) {
            throw new RuntimeException("Category already exists with this name");
        }

        DoctorCategory category = DoctorCategory.builder()
                .name(req.getName())
                .description(req.getDescription())
                .build();

        return repo.save(category);
    }

    public List<DoctorCategory> getAll() {
        return repo.findAll();
    }

    public long getCategoryCount() {

        return repo.count();
    }
}