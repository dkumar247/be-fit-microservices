package com.ai.based.fitness.aiservice.service;

import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class GeminiService {

  private final WebClient webClient;

  @Value("${gemini.api.url}")
  private String geminiApiUrl;

  @Value("${gemini.api.key}")
  private String getGeminiApiKey;

  public GeminiService(WebClient.Builder webClientBuilder) {
    this.webClient = webClientBuilder.build();
  }

  public String getAnswer(String question) {
    Map<String, Object> requestBody = Map.of("contents", new Object[]{
            Map.of("parts", new Object[]{
                    Map.of("text", question)
            })
    });

    String response = webClient.post()
            .uri(geminiApiUrl + getGeminiApiKey)
            .header("Content-Type", "application/json")
            .bodyValue(requestBody)
            .retrieve()
            .bodyToMono(String.class)
            .block();

    return response;
  }
}
