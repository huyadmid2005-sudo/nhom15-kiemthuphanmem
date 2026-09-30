package com.vuong.cdssservice.controller;

import com.vuong.cdssservice.dto.RecommendationCreateDto;
import com.vuong.cdssservice.dto.RecommendationDto;
import com.vuong.cdssservice.exception.CustomException;
import com.vuong.cdssservice.service.HealthCareService;
import com.vuong.cdssservice.service.implementation.HealthCareServiceImplementation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/recommendation")
public class HealthRCMFromDoctorController {
    @Autowired
    private HealthCareService service;

    //for doctor
    @PostMapping("/from-doctor/create")
    public ResponseEntity<?> createRecommendation(@RequestBody RecommendationCreateDto recommendationDto) throws CustomException {
        log.info("inside createRecommendation method from HealthRCMFromDoctorController class");
        return new ResponseEntity<>(service.create(recommendationDto), HttpStatus.CREATED);
    }

    //for patient
    @GetMapping("/from-doctor/get/byPatient")
    public ResponseEntity<?> getAllRecommendationByPatient() throws CustomException {
        log.info("inside getRecommendationByPatient method from HealthRCMFromDoctorController class");
        return new ResponseEntity<>(service.getByPatient(), HttpStatus.CREATED);
    }

    //for doctor
    @GetMapping("/from-doctor/get/byDoctor")
    public ResponseEntity<?> getAllRecommendationByDoctor() throws CustomException {
        log.info("inside getRecommendationByPatient method from HealthRCMFromDoctorController class");
        return new ResponseEntity<>(service.getByDoctor(), HttpStatus.CREATED);
    }

    //for doctor and patient
    @GetMapping("/from-doctor/get/byId/{recommendationId}")
    public ResponseEntity<?> getRecommendationById(@PathVariable Long recommendationId) throws CustomException {
        log.info("inside getRecommendationByPatient method from HealthRCMFromDoctorController class");
        return new ResponseEntity<>(service.getById(recommendationId), HttpStatus.CREATED);
    }

    //for doctor
    @PutMapping("/from-doctor/edit/{recommendationId}")
    public ResponseEntity<?> updateRecommendationByDoctor(@PathVariable Long recommendationId, @RequestBody RecommendationCreateDto recommendationDto) throws CustomException {
        log.info("inside updateRecommendation method from HealthRCMFromDoctorController class");
        return new ResponseEntity<>(service.updateByDoctor(recommendationId, recommendationDto), HttpStatus.OK);
    }

    //for doctor
    @DeleteMapping("/from-doctor/delete/{recommendationId}")
    public ResponseEntity<?> deleteRecommendationByDoctor(@PathVariable Long recommendationId) throws CustomException {
        log.info("inside updateRecommendation method from HealthRCMFromDoctorController class");
        service.deleteIdByDoctor(recommendationId);
        return new ResponseEntity<>("delete recommendation successfully", HttpStatus.OK);
    }
}
