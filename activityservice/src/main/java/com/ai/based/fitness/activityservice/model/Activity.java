package com.ai.based.fitness.activityservice.model;

import java.time.LocalDateTime;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "activities")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Activity {

  @Id
  private String id;
  private String userId;
  private ActivityType type;
  private Integer duration;
  private Integer caloriesBurned;
  private LocalDateTime startTime;

  @Field("metrics")
  private Map<String, Object> additionalMetric;

  @CreatedDate
  private LocalDateTime createdAt;

  //  Creation timestamp annotation is relation database specific so not used here.
  @LastModifiedDate
  private LocalDateTime updatedAt;
}
