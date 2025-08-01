package com.ai.based.fitness.userservice.controller;

import com.ai.based.fitness.userservice.dto.RegisterRequest;
import com.ai.based.fitness.userservice.dto.UserResponse;
import com.ai.based.fitness.userservice.service.UserService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

  @Autowired
  private UserService userService;

  @GetMapping("/{userId}")
  public ResponseEntity<UserResponse> getUserProfile(@PathVariable String userId) {
    return ResponseEntity.ok(userService.getUserProfile(userId));
  }

  @PostMapping("/register")
  public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
    return ResponseEntity.ok(userService.register(request));
  }

  @GetMapping("/{userId}/validate")
  public ResponseEntity<Boolean> valdiateUser(@PathVariable String userId) {
    return ResponseEntity.ok(userService.existsByUserId(userId));
  }
}
