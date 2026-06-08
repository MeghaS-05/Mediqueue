package com.mediqueue.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "queue_entries")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueueEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @Column(nullable = false)
    private Integer position;

    @Column(name = "est_wait_mins")
    private Integer estWaitMins;

    @Column(name = "checked_in_at")
    @Builder.Default
    private LocalDateTime checkedAt = LocalDateTime.now();
}
