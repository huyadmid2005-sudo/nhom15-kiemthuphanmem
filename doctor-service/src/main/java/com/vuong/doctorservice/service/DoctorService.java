package com.vuong.doctorservice.service;

import com.vuong.doctorservice.dto.DoctorDto;
import com.vuong.doctorservice.dto.DoctorRegistrationRequestDto;
import com.vuong.doctorservice.exception.CustomException;

import java.util.List;

public interface DoctorService {
    DoctorDto registerDoctor(DoctorRegistrationRequestDto doctorRegistrationRequestDto) throws CustomException;
    DoctorDto getDoctorById(String doctorId) throws CustomException;
    DoctorDto getDoctorByEmail(String email) throws CustomException;
    DoctorDto getCurrentDoctor() throws CustomException;
    void updateDoctorProfile(DoctorDto doctorDto) throws CustomException;
    void approveDoctor(String doctorId, String roomNo) throws CustomException;
    List<String> getDoctorDepartmentList() throws CustomException;
    List<DoctorDto> getDoctorListByDepartment(String department) throws CustomException;
    List<DoctorDto> getDoctorList() throws CustomException;
    void approveDoctorAndAllocateRoom(String doctorId, String roomNo) throws CustomException;
    List<DoctorDto> getApprovedDoctorList() throws CustomException;
    Long countTotalDoctors() throws CustomException;
    List<DoctorDto> searchDoctorByName(String name) throws CustomException;
    List<DoctorDto> searchDoctorByDepartment(String department) throws CustomException;
}

