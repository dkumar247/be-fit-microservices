package com.ai.based.fitness.aiservice.service;

import com.ai.based.fitness.aiservice.model.Activity;
import com.ai.based.fitness.aiservice.model.Recommendation;
import com.ai.based.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

  private final ActivityAIService aiService;
  private final RecommendationRepository repository;

  @RabbitListener(queues = "${rabbitmq.queue.name}")
  public void processActivity(Activity activity) {
    log.info("Received activity by AI service for processing: {}", activity.getId());
//    this generates recommendation
//    log.info("Generated Recommendation: {}", aiService.generateRecommendation(activity));

    try {
      Recommendation recommendation = aiService.generateRecommendation(activity);
      log.info("Attempting to save recommendation: {}", recommendation);

      repository.save(recommendation);
      log.info("Successfully saved recommendation for activity: {}", activity.getId());

    } catch (DataAccessException e) {
      log.error("Database error while saving recommendation", e);
      throw e;
    } catch (Exception e) {
      log.error("Error processing activity", e);
      throw e;
    }
  }
}
