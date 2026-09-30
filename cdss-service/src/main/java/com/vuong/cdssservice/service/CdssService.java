package com.vuong.cdssservice.service;

import com.vuong.cdssservice.dto.HealthRecommendationDto;
import com.vuong.cdssservice.exception.CustomException;

import java.util.List;

public interface CdssService {
//    String getResponseFromOpenAi(String prompt) throws CustomException;
    String generateHealthRecommendation() throws CustomException;
    List<HealthRecommendationDto> getAllHealthRecommendations() throws CustomException;
    HealthRecommendationDto getHealthRecommendationById(Long id) throws CustomException;
    List<HealthRecommendationDto> getHealthRecommendationByPatientId(String patientId) throws CustomException;

}
