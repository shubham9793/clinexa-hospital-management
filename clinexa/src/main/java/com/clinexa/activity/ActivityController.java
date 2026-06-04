package com.clinexa.activity;

import com.clinexa.activity.dto.ActivityDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    public List<ActivityDto> getActivities() {
        return activityService.getRecentActivities();
    }
}