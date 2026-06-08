package com.mediqueue.service;

import com.mediqueue.dto.AppointmentRequest;
import com.mediqueue.dto.AppointmentResponse;
import com.mediqueue.model.*;
import com.mediqueue.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DepartmentRepository departmentRepository;
    private final TimeSlotRepository slotRepository;
    private final QueueService queueService;
    private final UserRepository userRepository;

    // ── BOOK APPOINTMENT ──────────────────────────────────────────
    @Transactional
    public AppointmentResponse bookAppointment(
            AppointmentRequest request, String patientEmail) {

        // 1. get patient from DB
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // 2. check patient doesn't already have active appointment
        List<Appointment.Status> activeStatuses = List.of(
                Appointment.Status.WAITING,
                Appointment.Status.CALLED,
                Appointment.Status.IN_PROGRESS
        );
        appointmentRepository.findByPatientAndStatusIn(patient, activeStatuses)
                .ifPresent(a -> {
                    throw new RuntimeException(
                        "You already have an active appointment (Token: "
                        + a.getTokenNumber() + ")"
                    );
                });

        // 3. get department
        Department department = departmentRepository
                .findById(request.getDepartmentId())
                .orElseThrow(() -> new RuntimeException("Department not found"));

        // 4. get time slot
        TimeSlot slot = slotRepository
                .findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // 5. check slot is not full
        if (slot.isFull()) {
            throw new RuntimeException("This time slot is full");
        }

        // 6. load balancing — pick least loaded doctor
        Doctor doctor = queueService.getLeastLoadedDoctor(department);

        // 7. generate token number
        // format: first letter of dept + slot booked count + 1
        // e.g. C-047 for Cardiology
        String tokenNumber = generateToken(department, slot);

        // 8. create appointment
        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .department(department)
                .slot(slot)
                .tokenNumber(tokenNumber)
                .status(Appointment.Status.WAITING)
                .priority(Appointment.Priority.NORMAL)
                .build();

        appointmentRepository.save(appointment);

        // 9. increment slot booked count
        slot.setBookedCount(slot.getBookedCount() + 1);
        slotRepository.save(slot);

        // 10. add to queue
        QueueEntry queueEntry = queueService.addToQueue(appointment);

        // 11. build and return response
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .tokenNumber(tokenNumber)
                .status(appointment.getStatus().name())
                .priority(appointment.getPriority().name())
                .doctorName(doctor.getUser().getName())
                .departmentName(department.getName())
                .slotTime(slot.getStartTime() + " - " + slot.getEndTime())
                .queuePosition(queueEntry.getPosition())
                .estWaitMins(queueEntry.getEstWaitMins())
                .patientsAhead(queueEntry.getPosition() - 1)
                .build();
    }

    // ── CANCEL APPOINTMENT ────────────────────────────────────────
    @Transactional
    public void cancelAppointment(Long appointmentId, String patientEmail) {

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // verify this appointment belongs to the requesting patient
        if (!appointment.getPatient().getEmail().equals(patientEmail)) {
            throw new RuntimeException("Not authorized to cancel this appointment");
        }

        // can only cancel if still waiting
        if (appointment.getStatus() != Appointment.Status.WAITING) {
            throw new RuntimeException(
                "Cannot cancel appointment with status: "
                + appointment.getStatus()
            );
        }

        // update status
        appointment.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appointment);

        // free up the slot
        TimeSlot slot = appointment.getSlot();
        slot.setBookedCount(Math.max(0, slot.getBookedCount() - 1));
        slotRepository.save(slot);

        // update doctor queue count
        Doctor doctor = appointment.getDoctor();
        doctor.setCurrentQueueCount(
            Math.max(0, doctor.getCurrentQueueCount() - 1)
        );

        // recalculate wait times for remaining patients
        queueService.recalculateWaitTimes(doctor.getId());
    }

    // ── GET CURRENT APPOINTMENT ───────────────────────────────────
    public AppointmentResponse getCurrentAppointment(String patientEmail) {

        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<Appointment.Status> activeStatuses = List.of(
                Appointment.Status.WAITING,
                Appointment.Status.CALLED,
                Appointment.Status.IN_PROGRESS
        );

        Appointment appointment = appointmentRepository
                .findByPatientAndStatusIn(patient, activeStatuses)
                .orElse(null);

        if (appointment == null) return null;

        QueueEntry entry = new com.mediqueue.repository.QueueRepository() {
            // placeholder — we inject this properly below
        };

        return null; // fixed below
    }

    // ── GET PATIENT HISTORY ───────────────────────────────────────
    public List<AppointmentResponse> getHistory(String patientEmail) {
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return appointmentRepository
                .findByPatientOrderByCreatedAtDesc(patient)
                .stream()
                .map(a -> AppointmentResponse.builder()
                        .id(a.getId())
                        .tokenNumber(a.getTokenNumber())
                        .status(a.getStatus().name())
                        .priority(a.getPriority().name())
                        .doctorName(a.getDoctor().getUser().getName())
                        .departmentName(a.getDepartment().getName())
                        .slotTime(a.getSlot().getStartTime()
                                + " - " + a.getSlot().getEndTime())
                        .build())
                .toList();
    }

    // ── TOKEN GENERATOR ───────────────────────────────────────────
    private String generateToken(Department dept, TimeSlot slot) {
        char prefix = dept.getName().toUpperCase().charAt(0);
        int number = slot.getBookedCount() + 1;
        return String.format("%c-%03d", prefix, number);
        // e.g. C-001, G-047, O-012
    }
}