package com.mediqueue.controller;

import com.mediqueue.dto.AppointmentRequest;
import com.mediqueue.dto.AppointmentResponse;
import com.mediqueue.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // POST /api/appointments
    // patient books an appointment
    @PostMapping
    public ResponseEntity<AppointmentResponse> book(
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            appointmentService.bookAppointment(
                request, userDetails.getUsername()
            )
        );
    }

    // DELETE /api/appointments/{id}
    // patient cancels their appointment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        appointmentService.cancelAppointment(id, userDetails.getUsername());
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled"));
    }

    // GET /api/appointments/history
    // patient views their past appointments
    @GetMapping("/history")
    public ResponseEntity<List<AppointmentResponse>> history(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(
            appointmentService.getHistory(userDetails.getUsername())
        );
    }
}