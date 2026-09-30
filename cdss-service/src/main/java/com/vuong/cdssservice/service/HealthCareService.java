package com.vuong.cdssservice.service;

import com.vuong.cdssservice.dto.RecommendationCreateDto;
import com.vuong.cdssservice.dto.RecommendationDto;
import com.vuong.cdssservice.exception.CustomException;
import org.springframework.http.HttpStatusCode;

import java.util.List;

public interface HealthCareService {
    RecommendationDto create(RecommendationCreateDto recommendationDto) throws CustomException;

    List<RecommendationDto> getByPatient() throws CustomException;

    List<RecommendationDto> getByDoctor() throws CustomException;

    RecommendationDto updateByDoctor(Long recommendationId, RecommendationCreateDto recommendationDto) throws CustomException;

    void deleteIdByDoctor(Long recommendationId) throws CustomException;

    RecommendationDto getById(Long recommendationId) throws CustomException;
}
