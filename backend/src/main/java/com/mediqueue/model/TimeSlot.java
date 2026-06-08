package com.mediqueue.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "time_slots")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "max_capacity", nullable = false)
    @Builder.Default
    private Integer maxCapacity = 12;

    @Column(name = "booked_count", nullable = false)
    @Builder.Default
    private Integer bookedCount = 0;

    public boolean isFull(){
        return bookedCount >= maxCapacity;
    }

    public int slotsLeft(){
        return maxCapacity - bookedCount;
    }
}
