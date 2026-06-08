package com.mediqueue.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity                    // tells Spring: this class = a database table
@Table(name = "users")     // table will be named "users" in PostgreSQL
@Data                      // Lombok: auto-generates getters, setters, toString
@Builder                   // Lombok: lets us do User.builder().name("X").build()
@NoArgsConstructor         // Lombok: creates empty constructor User()
@AllArgsConstructor        // Lombok: creates constructor with all fields
public class User {

    @Id                                           
    @GeneratedValue(strategy = GenerationType.IDENTITY) 
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @Email
    @NotBlank
    @Column(nullable = false, unique = true)  
    private String email;

    @Column                   
    private String password;

    @Column
    private String phone;

    @Column
    private Integer age;

    @Enumerated(EnumType.STRING)   
    @Column(nullable = false)
    private Role role;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    // defines the allowed roles
    public enum Role {
        PATIENT, DOCTOR, ADMIN
    }
}