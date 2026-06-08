package com.mediqueue.repository;

import com.mediqueue.model.Department;
import com.mediqueue.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    // get all slots for a department on a specific date
    List<TimeSlot> findByDepartmentAndSlotDate(
            Department department, LocalDate date);

    // get available (not full) slots
    List<TimeSlot> findByDepartmentAndSlotDateAndBookedCountLessThan(
            Department department, LocalDate date, int maxCapacity);
}
