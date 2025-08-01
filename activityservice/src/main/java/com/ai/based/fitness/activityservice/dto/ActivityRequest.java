package com.ai.based.fitness.activityservice.dto;

import com.ai.based.fitness.activityservice.model.ActivityType;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.Data;

@Data
public class ActivityRequest {

  private String userId;
  private ActivityType type;
  private Integer duration;
  private Integer caloriesBurned;
  private LocalDateTime startTime;
  private Map<String, Object> additionalMetrics;

}
