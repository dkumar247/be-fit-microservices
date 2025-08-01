package com.ai.based.fitness.aiservice.model;

import java.time.LocalDateTime;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activities")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Activity {

  private String id;
  private String userId;
  private String type;
  private Integer duration;
  private Integer caloriesBurned;
  private LocalDateTime startTime;
  private Map<String, Object> additionalMetric;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}
