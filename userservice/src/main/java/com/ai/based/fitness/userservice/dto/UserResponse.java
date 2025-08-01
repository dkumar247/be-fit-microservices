package com.ai.based.fitness.userservice.dto;

import com.ai.based.fitness.userservice.model.UserRole;
import java.time.LocalDateTime;
import lombok.Data;

@Data
public class UserResponse {

  private String id;
  private String email;
  private String password;
  private String firstName;
  private String lastName;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

}
