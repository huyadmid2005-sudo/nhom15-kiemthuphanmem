package com.vuong.communityportalservice.service.support;

import com.vuong.communityportalservice.dto.ArticleActorDto;
import com.vuong.communityportalservice.dto.DoctorDto;
import com.vuong.communityportalservice.dto.PatientDto;
import com.vuong.communityportalservice.dto.ResponseMessageDto;
import com.vuong.communityportalservice.enums.ArticleActorType;
import com.vuong.communityportalservice.exception.CustomException;
import com.vuong.communityportalservice.networkmanager.DoctorServiceFeignClient;
import com.vuong.communityportalservice.networkmanager.PatientServiceFeignClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class ArticleActorResolver {

    @Autowired
    private PatientServiceFeignClient patientServiceFeignClient;

    @Autowired
    private DoctorServiceFeignClient doctorServiceFeignClient;

    public ArticleActorDto getRequiredCurrentActor() throws CustomException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getAuthorities() == null) {
            throw new CustomException(
                    new ResponseMessageDto("You are not authorized", HttpStatus.UNAUTHORIZED),
                    HttpStatus.UNAUTHORIZED);
        }

        boolean isDoctor = authentication.getAuthorities().stream()
                .anyMatch(authority -> "Doctor".equalsIgnoreCase(authority.getAuthority()));
        boolean isPatient = authentication.getAuthorities().stream()
                .anyMatch(authority -> "Patient".equalsIgnoreCase(authority.getAuthority()));

        if (isDoctor) {
            return resolveCurrentDoctor();
        }
        if (isPatient) {
            return resolveCurrentPatient();
        }

        throw new CustomException(
                new ResponseMessageDto("This account cannot interact with articles", HttpStatus.FORBIDDEN),
                HttpStatus.FORBIDDEN);
    }

    public Optional<ArticleActorDto> getCurrentActorIfAvailable() {
        try {
            return Optional.of(getRequiredCurrentActor());
        } catch (Exception exception) {
            return Optional.empty();
        }
    }

    public String resolveActorName(String actorId, ArticleActorType actorType) {
        if (actorId == null || actorType == null) {
            return "Unknown user";
        }

        try {
            if (actorType == ArticleActorType.DOCTOR) {
                ResponseEntity<DoctorDto> doctorResponse = doctorServiceFeignClient.getDoctorById(actorId);
                DoctorDto doctor = doctorResponse.getBody();
                if (doctor != null) {
                    return buildFullName(doctor.getFirstName(), doctor.getLastName());
                }
            } else {
                ResponseEntity<PatientDto> patientResponse = patientServiceFeignClient.getPatientById(actorId);
                PatientDto patient = patientResponse.getBody();
                if (patient != null) {
                    return buildFullName(patient.getFirstName(), patient.getLastName());
                }
            }
        } catch (Exception exception) {
            log.warn("Could not resolve actor name for {} {}", actorType, actorId);
        }

        return "Unknown user";
    }

    private ArticleActorDto resolveCurrentPatient() throws CustomException {
        try {
            ResponseEntity<PatientDto> response = patientServiceFeignClient.getCurrentPatient();
            PatientDto patient = response.getBody();

            if (patient == null || response.getStatusCode() != HttpStatus.OK) {
                throw new CustomException(
                        new ResponseMessageDto("You are not authorized", HttpStatus.UNAUTHORIZED),
                        HttpStatus.UNAUTHORIZED);
            }

            if (!patient.isApproved()) {
                throw new CustomException(
                        new ResponseMessageDto("Patient account is not approved", HttpStatus.FORBIDDEN),
                        HttpStatus.FORBIDDEN);
            }

            return new ArticleActorDto(
                    patient.getPatientId(),
                    buildFullName(patient.getFirstName(), patient.getLastName()),
                    ArticleActorType.PATIENT);
        } catch (CustomException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Error fetching current patient: {}", exception.getMessage());
            throw new CustomException(
                    new ResponseMessageDto("Unable to verify patient identity", HttpStatus.UNAUTHORIZED),
                    HttpStatus.UNAUTHORIZED);
        }
    }

    private ArticleActorDto resolveCurrentDoctor() throws CustomException {
        try {
            ResponseEntity<DoctorDto> response = doctorServiceFeignClient.getCurrentDoctor();
            DoctorDto doctor = response.getBody();

            if (doctor == null || response.getStatusCode() != HttpStatus.OK) {
                throw new CustomException(
                        new ResponseMessageDto("You are not authorized", HttpStatus.UNAUTHORIZED),
                        HttpStatus.UNAUTHORIZED);
            }

            if (!doctor.isApproved()) {
                throw new CustomException(
                        new ResponseMessageDto("Doctor account is not approved", HttpStatus.FORBIDDEN),
                        HttpStatus.FORBIDDEN);
            }

            return new ArticleActorDto(
                    doctor.getDoctorId(),
                    buildFullName(doctor.getFirstName(), doctor.getLastName()),
                    ArticleActorType.DOCTOR);
        } catch (CustomException exception) {
            throw exception;
        } catch (Exception exception) {
            log.error("Error fetching current doctor: {}", exception.getMessage());
            throw new CustomException(
                    new ResponseMessageDto("Unable to verify doctor identity", HttpStatus.UNAUTHORIZED),
                    HttpStatus.UNAUTHORIZED);
        }
    }

    private String buildFullName(String firstName, String lastName) {
        String safeFirstName = firstName == null ? "" : firstName.trim();
        String safeLastName = lastName == null ? "" : lastName.trim();
        String fullName = (safeFirstName + " " + safeLastName).trim();
        return fullName.isEmpty() ? "Unknown user" : fullName;
    }
}
