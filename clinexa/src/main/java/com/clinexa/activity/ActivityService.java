package com.clinexa.activity;

import com.clinexa.activity.dto.ActivityDto;
import com.clinexa.doctor.DoctorRepository;
import com.clinexa.receptionist.ReceptionistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final DoctorRepository doctorRepository;
    private final ReceptionistRepository receptionistRepository;

    public List<ActivityDto> getRecentActivities() {

        List<ActivityDto> activities = new ArrayList<>();

        doctorRepository
                .findTop5ByOrderByCreatedAtDesc()
                .forEach(d -> {

                    System.out.println(
                            "Doctor = "
                                    + d.getName()
                                    + " | createdAt = "
                                    + d.getCreatedAt()
                    );

                    activities.add(
                            new ActivityDto(
                                    "DOCTOR",
                                    "Doctor " + d.getName() + " added",
                                    d.getCreatedAt()
                            )
                    );
                });

        receptionistRepository
                .findTop5ByOrderByCreatedAtDesc()
                .forEach(r -> {

                    System.out.println(
                            "Receptionist = "
                                    + r.getName()
                                    + " | createdAt = "
                                    + r.getCreatedAt()
                    );

                    activities.add(
                            new ActivityDto(
                                    "RECEPTIONIST",
                                    "Receptionist " + r.getName() + " added",
                                    r.getCreatedAt()
                            )
                    );
                });

        return activities.stream()
                .filter(a -> a.getCreatedAt() != null)
                .sorted(
                        Comparator.comparing(
                                ActivityDto::getCreatedAt
                        ).reversed()
                )
                .limit(5)
                .toList();
    }
}
