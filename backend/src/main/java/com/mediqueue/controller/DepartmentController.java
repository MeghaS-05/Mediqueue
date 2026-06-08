package com.mediqueue.controller;

import com.mediqueue.dto.DepartmentResponse;
import com.mediqueue.dto.SlotResponse;
import com.mediqueue.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    // GET /api/departments
    // React calls this to show department list
    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    // GET /api/departments/{id}/slots
    // React calls this after patient selects a department
    @GetMapping("/{id}/slots")
    public ResponseEntity<List<SlotResponse>> getSlots(@PathVariable Long id) {
        return ResponseEntity.ok(departmentService.getTodaySlots(id));
    }
}