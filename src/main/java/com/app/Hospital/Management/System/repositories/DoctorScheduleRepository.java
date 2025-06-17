package com.app.Hospital.Management.System.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.app.Hospital.Management.System.entities.DoctorSchedule;
import com.app.Hospital.Management.System.entities.Notification;
import com.app.Hospital.Management.System.entities.ScheduledId;
@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, ScheduledId> {

	
	List<DoctorSchedule> findByDoctorId(Long id);

	Optional<DoctorSchedule> findByDoctorIdAndDate(Long doctorId, LocalDate newDate);

	

}