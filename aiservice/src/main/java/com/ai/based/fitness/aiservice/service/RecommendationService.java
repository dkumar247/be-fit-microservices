package com.ai.based.fitness.aiservice.service;

import com.ai.based.fitness.aiservice.model.Recommendation;
import com.ai.based.fitness.aiservice.repository.RecommendationRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RecommendationService {

  private final RecommendationRepository repository;

  public List<Recommendation> getUserRecommendation(String userId) {
    return repository.findByUserId(userId);
  }

  public Recommendation getActivityRecommendation(String activityId) {
    return repository.findByActivityId(activityId).orElseThrow(
            () -> new RuntimeException("No Recommendation Found for this activity: " + activityId));
  }
}
