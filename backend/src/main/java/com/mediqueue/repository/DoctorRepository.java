package com.mediqueue.repository;

import com.mediqueue.model.Department;
import com.mediqueue.model.Doctor;
import com.mediqueue.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByDepartmentAndIsAvailableTrue(Department department);
    Optional<Doctor> findByUser(User user);
    List<Doctor> findByDepartment(Department department);
}
