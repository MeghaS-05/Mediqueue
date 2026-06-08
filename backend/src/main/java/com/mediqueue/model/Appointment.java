package com.mediqueue.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private User patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @ManyToOne
    @JoinColumn(name = "slot_id", nullable = false)
    private TimeSlot slot;

    // e.g. "A-047" — unique per slot
    @Column(name = "token_number", nullable = false)
    private String tokenNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Priority priority = Priority.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.WAITING;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "called_at")
    private LocalDateTime calledAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum Priority {
        NORMAL, URGENT, EMERGENCY
    }

    public enum Status {
        WAITING,      // patient is waiting in queue
        CALLED,       // doctor called patient
        IN_PROGRESS,  // consultation happening
        DONE,         // consultation complete
        NO_SHOW,      // patient didn't show up
        CANCELLED     // patient cancelled
    }
}