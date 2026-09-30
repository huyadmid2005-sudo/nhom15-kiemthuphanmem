package com.vuong.patientservice.service;

import com.vuong.patientservice.dto.HealthRecordDto;
import com.vuong.patientservice.exception.CustomException;

import java.util.List;

public interface HealthRecordService {
    void createHealthRecord(HealthRecordDto healthRecordDto) throws CustomException;
    HealthRecordDto getHealthRecord(Long healthRecordId) throws CustomException;
    List<HealthRecordDto> getAllHealthRecords() throws CustomException;
    List<HealthRecordDto> getPatientsHealthRecords(String patientId) throws CustomException;
    void updateHealthRecord(HealthRecordDto healthRecordDto) throws CustomException;
    void deleteHealthRecord(Long healthRecordId) throws CustomException;
}
