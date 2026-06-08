package com.mediqueue.service;

import com.mediqueue.dto.DepartmentResponse;
import com.mediqueue.dto.SlotResponse;
import com.mediqueue.model.Department;
import com.mediqueue.model.TimeSlot;
import com.mediqueue.repository.DepartmentRepository;
import com.mediqueue.repository.DoctorRepository;
import com.mediqueue.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DoctorRepository doctorRepository;
    private final TimeSlotRepository slotRepository;

    // get all active departments with doctor count
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findByActiveTrue()
                .stream()
                .map(d -> DepartmentResponse.builder()
                        .id(d.getId())
                        .name(d.getName())
                        .avgConsultMins(d.getAvgConsultMins())
                        .availableDoctors(
                            doctorRepository
                                .findByDepartmentAndIsAvailableTrue(d).size()
                        )
                        .totalDoctors(
                            doctorRepository.findByDepartment(d).size()
                        )
                        .build())
                .toList();
    }

    public List<SlotResponse> getTodaySlots(Long departmentId) {
        Department dept = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        return slotRepository
                .findByDepartmentAndSlotDate(dept, LocalDate.now())
                .stream()
                .map(s -> SlotResponse.builder()
                        .id(s.getId())
                        .startTime(s.getStartTime().toString())
                        .endTime(s.getEndTime().toString())
                        .maxCapacity(s.getMaxCapacity())
                        .bookedCount(s.getBookedCount())
                        .slotsLeft(s.slotsLeft())
                        .full(s.isFull())
                        .build())
                .toList();
    }
}