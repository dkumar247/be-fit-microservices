package com.ai.based.fitness.activityservice.dto;

import com.ai.based.fitness.activityservice.model.ActivityType;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.Data;

@Data
public class ActivityResponse {

  private String id;
  private String userId;
  private ActivityType type;
  private Integer duration;
  private Integer caloriesBurned;
  private LocalDateTime startTime;
  private Map<String, Object> additionalMetric;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

}
