package com.ai.based.fitness.userservice.service;

import com.ai.based.fitness.userservice.dto.RegisterRequest;
import com.ai.based.fitness.userservice.dto.UserResponse;
import com.ai.based.fitness.userservice.model.User;
import com.ai.based.fitness.userservice.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserService {

  private final UserRepository repository;

  public UserResponse register(@Valid RegisterRequest request) {
    if (repository.existsByEmail(request.getEmail())) {
//      throw new RuntimeException(String.format("Email %s already exists!", request.getEmail()));
      User existingUser = repository.findByEmail(request.getEmail());
      UserResponse userResponse = new UserResponse();
      userResponse.setId(existingUser.getId());
      userResponse.setKeycloakId(existingUser.getKeycloakId());
      userResponse.setPassword(existingUser.getPassword());
      userResponse.setEmail(existingUser.getEmail());
      userResponse.setFirstName(existingUser.getFirstName());
      userResponse.setLastName(existingUser.getLastName());
      userResponse.setCreatedAt(existingUser.getCreatedAt());
      userResponse.setUpdatedAt(existingUser.getUpdatedAt());
      return userResponse;
    }

    User user = new User();
    user.setEmail(request.getEmail());
    user.setPassword(request.getPassword());
    user.setFirstName(request.getFirstName());
    user.setLastName(request.getLastName());
    user.setKeycloakId(request.getKeycloakId());

    User savedUser = repository.save(user);
    UserResponse userResponse = new UserResponse();
    userResponse.setId(savedUser.getId());
    userResponse.setPassword(savedUser.getPassword());
    userResponse.setEmail(savedUser.getEmail());
    userResponse.setFirstName(savedUser.getFirstName());
    userResponse.setLastName(savedUser.getLastName());
    userResponse.setCreatedAt(savedUser.getCreatedAt());
    userResponse.setUpdatedAt(savedUser.getUpdatedAt());

    return userResponse;
  }

  public UserResponse getUserProfile(String userId) {
    User user = repository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found!"));

    UserResponse userResponse = new UserResponse();
    userResponse.setId(user.getId());
    userResponse.setPassword(user.getPassword());
    userResponse.setEmail(user.getEmail());
    userResponse.setFirstName(user.getFirstName());
    userResponse.setLastName(user.getLastName());
    userResponse.setCreatedAt(user.getCreatedAt());
    userResponse.setUpdatedAt(user.getUpdatedAt());

    return userResponse;
  }

  public Boolean existsByUserId(String userId) {
    log.info("Calling User Validation API for userId: {}", userId);
//    now made user identifiabel by keycloak id as frontend also requires this kind of id, better to do it now.
    return repository.existsByKeycloakId(userId);
  }
}
