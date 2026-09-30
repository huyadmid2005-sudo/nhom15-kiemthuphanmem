package com.vuong.cdssservice.service.implementation;

import com.vuong.cdssservice.dto.*;
import com.vuong.cdssservice.entity.Recommendation;
import com.vuong.cdssservice.entity.RecommendationItem;
import com.vuong.cdssservice.exception.CustomException;
import com.vuong.cdssservice.networkmanager.DoctorServiceFeignClient;
import com.vuong.cdssservice.networkmanager.NotificationServiceFeignClient;
import com.vuong.cdssservice.networkmanager.PatientServiceFeignClient;
import com.vuong.cdssservice.repository.RecommendationItemRepository;
import com.vuong.cdssservice.repository.RecommendationRepository;
import com.vuong.cdssservice.service.HealthCareService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class HealthCareServiceImplementation implements HealthCareService {
    @Autowired
    private NotificationServiceFeignClient notificationServiceFeignClient;

    @Autowired
    private DoctorServiceFeignClient doctorServiceFeignClient;

    @Autowired
    private RecommendationRepository recommendationRepository;

    @Autowired
    private PatientServiceFeignClient patientServiceFeignClient;

    @Autowired
    private RecommendationItemRepository recommendationItemRepository;

    @Override
    public RecommendationDto create(RecommendationCreateDto recommendationDto) throws CustomException {
        try {
            log.info("inside create method from HealthCareServiceImplementation class");
            DoctorDto doctorDto = doctorServiceFeignClient.getCurrentDoctor().getBody();
            Recommendation recommendation = new Recommendation();

            recommendation.setDoctorId(doctorDto.getDoctorId());
            recommendation.setPatientId(recommendationDto.getPatientId());
            recommendation.setRecommendationMessage(recommendationDto.getRecommendationMessage());
            recommendation.setCreatedAt(LocalDate.now());
            recommendation.setRescheduleAppointment(recommendationDto.getRescheduleAppointment());

            if (recommendationDto.getItems() != null) {
                for (ItemDto item : recommendationDto.getItems()) {
                    RecommendationItem recommendationItem = new RecommendationItem();
                    recommendationItem.setFrequency(item.getFrequency());
                    recommendationItem.setMedicalId(item.getMedicalId());
                    recommendationItem.setRecommendation(recommendation);
//                    recommendationItemRepository.save(recommendationItem);
                    recommendation.addItem(recommendationItem);
                }
            }

            recommendationRepository.save(recommendation);

            PatientDto patientDto = patientServiceFeignClient.getPatientById(recommendation.getPatientId()).getBody();

            // send notification to the patient
            try {
                log.info("inside create method from HealthCareServiceImplementation class");
                NotificationDto notificationDto = new NotificationDto();
                notificationDto.setUserId(patientDto.getUserId());
                notificationDto.setNotificationType("You have a recommendation from dr." + doctorDto.getLastName());
                notificationDto.setNotificationText("Check your health recommendation for more detail!");
                notificationDto.setTimestamp(LocalDateTime.now());
                notificationDto.setIsRead(false);
                notificationServiceFeignClient.createNotification(notificationDto);
            } catch (Exception ex) {
                log.error("Error occurred while sending notification to patient: {}", ex.getMessage());
                throw new CustomException(new ResponseMessageDto("Error occurred while sending notification to patient", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            log.info("Notification sent successfully");

            return RecommendationDto.builder()
                    .createdDate(recommendation.getCreatedAt())
                    .items(recommendationDto.getItems())
                    .patientId(recommendation.getPatientId())
                    .doctorId(recommendation.getDoctorId())
                    .recommendationMessage(recommendation.getRecommendationMessage())
                    .rescheduleAppointment(recommendation.getRescheduleAppointment())
                    .id(recommendation.getId())
                    .build();
        } catch (Exception e) {
            log.error("error in create method from HealthCareServiceImplementation class: {}", e.getMessage());
            throw new CustomException(new ResponseMessageDto("The cdss service is not available right now. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<RecommendationDto> getByPatient() throws CustomException {
        try {
            String patientId = patientServiceFeignClient.getCurrentPatient().getBody().getPatientId();

            return recommendationRepository.getAllByPatientId(patientId).stream()
                    .map(this::recommendationDto)
                    .toList();
        } catch (Exception e) {
            log.error("error in getByPatient method from HealthCareServiceImplementation class: {}", e.getMessage());
            throw new CustomException(new ResponseMessageDto("The cdss service is not available right now. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<RecommendationDto> getByDoctor() throws CustomException {
        try {
            String doctorId = doctorServiceFeignClient.getCurrentDoctor().getBody().getDoctorId();

            return recommendationRepository.getAllByDoctorId(doctorId).stream()
                    .map(this::recommendationDto)
                    .toList();
        } catch (Exception e) {
            log.error("error in getByDoctor method from HealthCareServiceImplementation class: {}", e.getMessage());
            throw new CustomException(new ResponseMessageDto("The cdss service is not available right now. Please try again later.", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public RecommendationDto updateByDoctor(Long recommendationId, RecommendationCreateDto recommendationDto) throws CustomException {
        Recommendation recommendation = recommendationRepository.findById(recommendationId).orElseThrow(
                () -> new CustomException(new ResponseMessageDto("Recommendation not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND)
        );

        recommendation.setRecommendationMessage(recommendationDto.getRecommendationMessage());
        recommendation.setRescheduleAppointment(recommendationDto.getRescheduleAppointment());
        recommendation.setCreatedAt(LocalDate.now());
        if (recommendation.getItems() != null && !recommendation.getItems().isEmpty()) {
            List<RecommendationItem> toRemove = new ArrayList<>(recommendation.getItems());
            toRemove.forEach(recommendation::removeItem);
        }

        if (recommendationDto.getItems() != null) {
            for (ItemDto it : recommendationDto.getItems()) {
                RecommendationItem item = new RecommendationItem();
                item.setMedicalId(it.getMedicalId());
                item.setFrequency(it.getFrequency());
                recommendation.addItem(item);
            }
        }

        return recommendationDto(recommendationRepository.save(recommendation));
    }


    @Override
    public void deleteIdByDoctor(Long recommendationId) throws CustomException {
        Recommendation recommendation = recommendationRepository.findById(recommendationId).orElseThrow(
                () -> new CustomException(new ResponseMessageDto("Recommendation not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND)
        );

        recommendationRepository.deleteById(recommendationId);
    }

    @Override
    public RecommendationDto getById(Long recommendationId) throws CustomException {
        Recommendation recommendation = recommendationRepository.findById(recommendationId).orElseThrow(
            () -> new CustomException(new ResponseMessageDto("Recommendation not found", HttpStatus.NOT_FOUND), HttpStatus.NOT_FOUND)
        );

        return this.recommendationDto(recommendation);
    }

    RecommendationDto recommendationDto(Recommendation recommendation) {
        return RecommendationDto.builder()
                .id(recommendation.getId())
                .rescheduleAppointment(recommendation.getRescheduleAppointment())
                .recommendationMessage(recommendation.getRecommendationMessage())
                .items(recommendation.getItems().stream().map(this::recommendationItem).toList())
                .patientId(recommendation.getPatientId())
                .doctorId(recommendation.getDoctorId())
                .createdDate(recommendation.getCreatedAt())
                .build();
    }

    ItemDto recommendationItem(RecommendationItem recommendationItem) {
        return ItemDto.builder()
                .frequency(recommendationItem.getFrequency())
                .medicalId(recommendationItem.getMedicalId())
                .build();
    }

}
