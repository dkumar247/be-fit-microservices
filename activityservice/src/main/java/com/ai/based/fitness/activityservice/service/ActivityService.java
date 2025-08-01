package com.ai.based.fitness.activityservice.service;

import com.ai.based.fitness.activityservice.dto.ActivityRequest;
import com.ai.based.fitness.activityservice.dto.ActivityResponse;
import com.ai.based.fitness.activityservice.model.Activity;
import com.ai.based.fitness.activityservice.repository.ActivityRepository;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

  private final ActivityRepository repository;
  private final UserValidationService userValidationService;
  private final RabbitTemplate rabbitTemplate;

  @Value("${rabbitmq.exchange.name}")
  private String exchange;

  @Value("${rabbitmq.routing.key}")
  private String routingKey;

  public ActivityResponse trackActivity(ActivityRequest request) {

    boolean isValidUser = userValidationService.validateUser(request.getUserId());
    if (!isValidUser) {
      throw new RuntimeException("Invalid User: " + request.getUserId());
    }

    Activity activity = Activity.builder()
            .userId(request.getUserId())
            .type(request.getType())
            .duration(request.getDuration())
            .caloriesBurned(request.getCaloriesBurned())
            .startTime(request.getStartTime())
            .additionalMetric(request.getAdditionalMetrics())
            .build();

    Activity savedActivity = repository.save(activity);

//    Publish to RabbitMQ for AI processing
    try {
      rabbitTemplate.convertAndSend(exchange, routingKey, savedActivity);
    } catch (Exception e) {
      log.error("Failed to publish activity to RabbitMQ: ", e);
    }
    return mapToResponse(savedActivity);
  }

  public List<ActivityResponse> getUserActivities(String userId) {
    List<Activity> activities = repository.findByUserId(userId);
    return activities.stream().map((this::mapToResponse))
            .collect(Collectors.toList());
  }

  private ActivityResponse mapToResponse(Activity activity) {
    ActivityResponse response = new ActivityResponse();
    response.setId(activity.getId());
    response.setUserId(activity.getUserId());
    response.setType(activity.getType());
    response.setDuration(activity.getDuration());
    response.setCaloriesBurned(activity.getCaloriesBurned());
    response.setStartTime(activity.getStartTime());
    response.setAdditionalMetric(activity.getAdditionalMetric());
    response.setCreatedAt(activity.getCreatedAt());
    response.setUpdatedAt(activity.getUpdatedAt());

    return response;
  }

  public ActivityResponse getActivityById(String activityId) {
    return repository.findById(activityId)
            .map(this::mapToResponse)
            .orElseThrow(() -> new RuntimeException("Activity not found with ID: " + activityId));
  }
}
