package com.mediqueue.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min=6, message = "Password must be at least 6 characters")
    private String password;

    private String phone;
    
    @Min(value = 1, message="Age must be valid")
    @Max(value=120, message = "Age must be valid")
    private Integer age;
}
