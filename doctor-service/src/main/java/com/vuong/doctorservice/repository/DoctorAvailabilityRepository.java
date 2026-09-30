package com.vuong.doctorservice.repository;

import com.vuong.doctorservice.entitiy.AppointmentEntity;
import com.vuong.doctorservice.entitiy.DoctorAvailabilityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailabilityEntity, Long> {
    @Query("SELECT da FROM DoctorAvailabilityEntity da WHERE da.doctor.doctorId = :doctorId AND da.date = :date")
    List<DoctorAvailabilityEntity> findByDoctorIdAndDate(@Param("doctorId") String doctorId, @Param("date") LocalDate date);

    @Query("SELECT da FROM DoctorAvailabilityEntity da " +
            "WHERE (da.date > :today AND da.isAvailable = true) " +
            "   OR (da.date = :today AND da.startTime > :nowTime AND da.isAvailable = true)")
    List<DoctorAvailabilityEntity> getAvailableAppointments(
            @Param("today") LocalDate today,
            @Param("nowTime") LocalTime nowTime
    );
}
