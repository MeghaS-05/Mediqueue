package com.mediqueue.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private String tokenNumber;
    private String status;
    private String priority;
    private String doctorName;
    private String departmentName;
    private String slotTime;

    // queue info
    private Integer queuePosition;
    private Integer estWaitMins;
    private Integer patientsAhead;
}
