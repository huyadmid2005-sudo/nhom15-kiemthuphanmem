package com.vuong.cdssservice.repository;

import com.vuong.cdssservice.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    @Query("SELECT r FROM Recommendation r WHERE r.patientId = :patientId")
    List<Recommendation> getAllByPatientId(@Param("patientId") String patientId);

    @Query("SELECT r FROM Recommendation r WHERE r.doctorId = :doctorId")
    List<Recommendation> getAllByDoctorId(@Param("doctorId") String doctorId);
}
