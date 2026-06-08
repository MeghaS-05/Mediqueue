package com.mediqueue.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "avg_consult_mins")
    @Builder.Default
    private Integer avgConsultMins = 0;

    @Column
    @Builder.Default
    private Boolean isAvailable = true;

    @Column(name = "current_queue_count")
    @Builder.Default
    private Integer currentQueueCount = 0;
}
