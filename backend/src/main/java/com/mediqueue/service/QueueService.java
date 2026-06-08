package com.mediqueue.service;

import com.mediqueue.model.*;
import com.mediqueue.repository.*;
import com.mediqueue.websocket.QueueBroadcastService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final QueueRepository queueRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final QueueBroadcastService broadcastService;

    // ── ADD TO QUEUE ─────────────────────────────────────────────
    @Transactional
    public QueueEntry addToQueue(Appointment appointment) {

        // get current queue size for this doctor
        List<QueueEntry> currentQueue = queueRepository
                .findWaitingByDoctorId(appointment.getDoctor().getId());

        // new patient goes to end of queue
        int position = currentQueue.size() + 1;

        // calculate estimated wait time
        // formula: avgConsultMins × patientsAhead
        int avgConsultMins = appointment.getDepartment().getAvgConsultMins();
        int estWaitMins = avgConsultMins * (position - 1);

        QueueEntry entry = QueueEntry.builder()
                .appointment(appointment)
                .position(position)
                .estWaitMins(estWaitMins)
                .build();

        queueRepository.save(entry);

        // update doctor's queue count
        Doctor doctor = appointment.getDoctor();
        doctor.setCurrentQueueCount(doctor.getCurrentQueueCount() + 1);
        doctorRepository.save(doctor);

        // broadcast update to all in this department
        broadcastQueueUpdate(appointment.getDepartment().getId());

        // send personal update to this patient
        sendPatientUpdate(appointment);

        return entry;
    }

    // ── WAIT TIME ALGORITHM ───────────────────────────────────────
    // Core formula: estimatedWait = avgConsultMins × patientsAhead
    public int calculateWaitTime(Long doctorId, Integer position,
                                  Integer avgConsultMins) {
        long patientsAhead = queueRepository
                .countPatientsAhead(doctorId, position);
        return (int) (avgConsultMins * patientsAhead);
    }

    // ── PRIORITY SCORE ALGORITHM ──────────────────────────────────
    // Lower score = higher priority (called first)
    // emergency = -1000, urgent = -300, normal = 0
    // long wait = bonus (reward patients who waited long)
    private int calculatePriorityScore(QueueEntry entry) {
        int baseScore = entry.getPosition();

        int priorityBoost = switch (entry.getAppointment().getPriority()) {
            case EMERGENCY -> -1000;
            case URGENT    -> -300;
            case NORMAL    -> 0;
        };

        return baseScore + priorityBoost;
    }

    // ── LOAD BALANCING ────────────────────────────────────────────
    // returns the doctor with fewest patients in the given department
    public Doctor getLeastLoadedDoctor(Department department) {
        List<Doctor> availableDoctors = doctorRepository
                .findByDepartmentAndIsAvailableTrue(department);

        if (availableDoctors.isEmpty()) {
            throw new RuntimeException(
                "No available doctors in " + department.getName()
            );
        }

        // sort by currentQueueCount ascending → pick first (least loaded)
        return availableDoctors.stream()
                .min(Comparator.comparing(Doctor::getCurrentQueueCount))
                .orElseThrow();
    }

    // ── RECALCULATE ALL WAIT TIMES ────────────────────────────────
    // called after every queue change (call next, cancel, emergency)
    @Transactional
    public void recalculateWaitTimes(Long doctorId) {
        List<QueueEntry> queue = queueRepository
                .findWaitingByDoctorId(doctorId);

        // sort by priority score
        queue.sort(Comparator.comparingInt(this::calculatePriorityScore));

        int avgConsultMins = queue.isEmpty() ? 8
                : queue.get(0).getAppointment()
                       .getDepartment().getAvgConsultMins();

        // reassign positions and recalculate wait times
        for (int i = 0; i < queue.size(); i++) {
            QueueEntry entry = queue.get(i);
            entry.setPosition(i + 1);
            entry.setEstWaitMins(avgConsultMins * i);
            queueRepository.save(entry);

            // send personal update to each patient
            sendPatientUpdate(entry.getAppointment());

            // if this patient is next (position 2) send "you are next" alert
            if (i == 1) {
                broadcastService.sendYouAreNext(
                    entry.getAppointment().getTokenNumber(),
                    entry.getAppointment().getDoctor().getUser().getName()
                );
            }
        }

        // broadcast department-wide update
        if (!queue.isEmpty()) {
            broadcastQueueUpdate(
                queue.get(0).getAppointment().getDepartment().getId()
            );
        }
    }

    // ── HELPERS ───────────────────────────────────────────────────
    private void broadcastQueueUpdate(Long departmentId) {
        broadcastService.broadcastQueueUpdate(
            departmentId,
            Map.of("type", "QUEUE_UPDATE", "departmentId", departmentId)
        );
    }

    private void sendPatientUpdate(Appointment appointment) {
        QueueEntry entry = queueRepository
                .findByAppointment(appointment).orElse(null);
        if (entry == null) return;

        broadcastService.sendPatientUpdate(
            appointment.getTokenNumber(),
            com.mediqueue.dto.AppointmentResponse.builder()
                .id(appointment.getId())
                .tokenNumber(appointment.getTokenNumber())
                .status(appointment.getStatus().name())
                .queuePosition(entry.getPosition())
                .estWaitMins(entry.getEstWaitMins())
                .patientsAhead(entry.getPosition() - 1)
                .doctorName(appointment.getDoctor().getUser().getName())
                .departmentName(appointment.getDepartment().getName())
                .build()
        );
    }
}