package com.vuong.patientservice.repository;

import com.vuong.patientservice.entity.HealthRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HealthRecordRepository extends JpaRepository<HealthRecordEntity, Long> {
    @Query("SELECT h FROM HealthRecordEntity h WHERE h.patient.patientId = :patientId")

    List<HealthRecordEntity> findByPatientId(@Param("patientId") String patientId);
}
