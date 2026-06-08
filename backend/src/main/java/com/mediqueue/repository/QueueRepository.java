package com.mediqueue.repository;

import com.mediqueue.model.Appointment;
import com.mediqueue.model.QueueEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QueueRepository extends JpaRepository<QueueEntry, Long> {

    Optional<QueueEntry> findByAppointment(Appointment appointment);

    // get all queue entries for a doctor's appointments
    @Query("""
        SELECT q FROM QueueEntry q
        WHERE q.appointment.doctor.id = :doctorId
        AND q.appointment.status = 'WAITING'
        ORDER BY q.position ASC
    """)
    List<QueueEntry> findWaitingByDoctorId(Long doctorId);

    // count waiting patients ahead of a position
    @Query("""
        SELECT COUNT(q) FROM QueueEntry q
        WHERE q.appointment.doctor.id = :doctorId
        AND q.appointment.status = 'WAITING'
        AND q.position < :position
    """)
    long countPatientsAhead(Long doctorId, Integer position);
}
