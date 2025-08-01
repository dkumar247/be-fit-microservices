package com.ai.based.fitness.activityservice.controller;

import com.ai.based.fitness.activityservice.dto.ActivityRequest;
import com.ai.based.fitness.activityservice.dto.ActivityResponse;
import com.ai.based.fitness.activityservice.service.ActivityService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

  private final ActivityService activityService;

  @PostMapping
  public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest request) {
    return ResponseEntity.ok(activityService.trackActivity(request));
  }

  @GetMapping
  public ResponseEntity<List<ActivityResponse>> getUserActivities(
          @RequestHeader("X-User-ID") String userId) {
    return ResponseEntity.ok(activityService.getUserActivities(userId));
  }

  @GetMapping("/{activityId}")
  public ResponseEntity<ActivityResponse> getActivity(
          @PathVariable String activityId) {
    return ResponseEntity.ok(activityService.getActivityById(activityId));
  }
}
