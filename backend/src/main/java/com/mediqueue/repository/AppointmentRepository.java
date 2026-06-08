package com.mediqueue.repository;

import com.mediqueue.model.Appointment;
import com.mediqueue.model.Doctor;
import com.mediqueue.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // get all appointments for a patient
    List<Appointment> findByPatientOrderByCreatedAtDesc(User patient);

    // get active appointments for a doctor (used by doctor dashboard)
    List<Appointment> findByDoctorAndStatusIn(
            Doctor doctor, List<Appointment.Status> statuses);

    // count waiting patients for a doctor (used by load balancer)
    long countByDoctorAndStatus(Doctor doctor, Appointment.Status status);

    // find patient's current active appointment
    Optional<Appointment> findByPatientAndStatusIn(
            User patient, List<Appointment.Status> statuses);

    // find by token number
    Optional<Appointment> findByTokenNumber(String tokenNumber);
}