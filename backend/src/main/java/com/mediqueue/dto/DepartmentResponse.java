package com.mediqueue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponse {
    private Long id;
    private String name;
    private int avgConsultMins;
    private int availableDoctors;
    private int totalDoctors;
}
