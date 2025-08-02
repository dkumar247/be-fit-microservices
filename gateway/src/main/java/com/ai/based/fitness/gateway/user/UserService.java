package com.ai.based.fitness.gateway.user;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

  private final WebClient userServiceWebClient;

  public Mono<Boolean> validateUser(String userId) {
    log.info("Calling User Validation API for userId: {}", userId);
    return userServiceWebClient
            .get()
            .uri("/api/users/{userId}/validate", userId)
            .retrieve()
            .bodyToMono(Boolean.class)
            .onErrorResume(WebClientResponseException.class, e -> {
              if (e.getStatusCode() == NOT_FOUND) {
                return Mono.error(new RuntimeException("User Not Found: " + userId));
              } else if (e.getStatusCode() == BAD_REQUEST) {
                return Mono.error(new RuntimeException("Invalid Request: " + userId));
              }
              return Mono.error(new RuntimeException("Unexpected error: " + e.getMessage()));
            });
  }

  public Mono<UserResponse> registerUser(
          RegisterRequest request) {
    log.info("Calling User Registration API for userId: {}", request.getEmail());
    return userServiceWebClient
            .post()
            .uri("/api/users/register")
            .bodyValue(request)
            .retrieve()
            .bodyToMono(UserResponse.class)
            .onErrorResume(WebClientResponseException.class, e -> {
              if (e.getStatusCode() == BAD_REQUEST) {
                return Mono.error(new RuntimeException("Invalid Request: " + e.getMessage()));
              } else if (e.getStatusCode() == INTERNAL_SERVER_ERROR) {
                return Mono.error(new RuntimeException("Internal Server Error: " + e.getMessage()));
              }
              return Mono.error(new RuntimeException("Unexpected error: " + e.getMessage()));
            });
  }
}
