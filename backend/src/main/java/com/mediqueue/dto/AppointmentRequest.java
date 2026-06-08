package com.mediqueue.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentRequest {
    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "Time slot is required")
    private Long slotId;
}
