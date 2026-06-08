package com.mediqueue.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SlotResponse {
    private Long id;
    private String startTime;
    private String endTime;
    private int maxCapacity;
    private int bookedCount;
    private int slotsLeft;
    private boolean full;
}
