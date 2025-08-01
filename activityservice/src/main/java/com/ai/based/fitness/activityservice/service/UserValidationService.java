package com.ai.based.fitness.activityservice.service;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserValidationService {

  private final WebClient userServiceWebClient;

  public boolean validateUser(String userId) {
    log.info("Calling User Validation API for userId: {}", userId);
    try {
      return Boolean.TRUE.equals(userServiceWebClient
              .get()
              .uri("/api/users/{userId}/validate", userId)
              .retrieve()
              .bodyToMono(Boolean.class)
              .block());
    } catch (WebClientResponseException e) {
      if (e.getStatusCode() == NOT_FOUND) {
        throw new RuntimeException("User Not Found: " + userId);
      } else if (e.getStatusCode() == BAD_REQUEST) {
        throw new RuntimeException("Invalid User ID: " + userId);
      }
    }
    return false;
  }
}
