package com.ai.based.fitness.aiservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * When we save: repository.save(activity);
 * <p>
 * Spring with @EnableMongoAuditing does this:
 * <ol>
 *   <li>Check if entity is new</li>
 *   <li>If new → set createdAt = now()</li>
 *   <li>Always set updatedAt = now()</li>
 *   <li>Then actually save to MongoDB</li>
 * </ol>
 */
@Configuration
@EnableMongoAuditing
public class MongoConfig {

}
