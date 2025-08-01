package com.ai.based.fitness.activityservice.repository;

import com.ai.based.fitness.activityservice.model.Activity;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

  List<Activity> findByUserId(String userId);
  
}
