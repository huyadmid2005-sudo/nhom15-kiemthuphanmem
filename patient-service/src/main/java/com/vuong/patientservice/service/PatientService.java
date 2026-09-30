package com.vuong.patientservice.service;

import com.vuong.patientservice.dto.PatientDto;
import com.vuong.patientservice.dto.PatientRegistrationRequestDto;
import com.vuong.patientservice.exception.CustomException;

import java.util.List;

public interface PatientService {
    PatientDto registerPatient(PatientRegistrationRequestDto registrationDto) throws CustomException;

    PatientDto getPatientById(String patientId) throws CustomException;

    PatientDto getPatientByEmail(String email) throws CustomException;

    PatientDto getCurrentPatient() throws CustomException;

    void updatePatientProfile(PatientDto patientDto) throws CustomException;

    List<PatientDto> getAllPatients() throws CustomException;
    List<PatientDto> getAllApprovedPatients() throws CustomException;
    List<PatientDto> getAllUnapprovedPatients() throws CustomException;
    void approvePatient(String patientId) throws CustomException;
    PatientDto getPatientByUserId(Long userId) throws CustomException;
    Long countTotalPatients() throws CustomException;
    List<PatientDto> searchPatientByName(String name) throws CustomException;
}
