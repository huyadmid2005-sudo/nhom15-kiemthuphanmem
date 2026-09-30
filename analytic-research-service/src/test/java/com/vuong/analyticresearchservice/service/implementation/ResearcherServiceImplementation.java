package com.vuong.analyticresearchservice.service.implementation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVWriter;
import com.vuong.analyticresearchservice.builderpattern.ResearcherBuilder;
import com.vuong.analyticresearchservice.dto.DataMailRequest;
import com.vuong.analyticresearchservice.dto.HealthRecordDto;
import com.vuong.analyticresearchservice.dto.ResearcherDto;
import com.vuong.analyticresearchservice.dto.ResponseMessageDto;
import com.vuong.analyticresearchservice.entity.ResearcherEntity;
import com.vuong.analyticresearchservice.exception.CustomException;
import com.vuong.analyticresearchservice.networkmanager.NotificationServiceFeignClient;
import com.vuong.analyticresearchservice.networkmanager.PatientServiceFeignClient;
import com.vuong.analyticresearchservice.repository.AnalyticResearchRepository;
import com.vuong.analyticresearchservice.service.ResearcherService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class ResearcherServiceImplementation implements ResearcherService {
    @Autowired
    private AnalyticResearchRepository analyticResearchRepository;
    @Autowired
    private PatientServiceFeignClient patientServiceFeignClient;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private NotificationServiceFeignClient notificationServiceFeignClient;
    @Autowired
    private ObjectMapper objectMapper;


    @Override
    public void registerResearcher(ResearcherDto researcherDto)  throws CustomException {
        try{
            log.info("Registering researcher with email: {}", researcherDto.getEmail());
            if (analyticResearchRepository.findByEmail(researcherDto.getEmail()).isPresent()) {
                log.error("Researcher with email: {} already exists", researcherDto.getEmail());
                throw new CustomException(new ResponseMessageDto("Researcher with email: " + researcherDto.getEmail() + " already exists", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
            }

            ResearcherEntity researcherEntity = new ResearcherBuilder()
                    .name(researcherDto.getName())
                    .email(researcherDto.getEmail())
                    .designation(researcherDto.getDesignation())
                    .institute(researcherDto.getInstitute())
                    .purpose(researcherDto.getPurpose())
                    .isValid(false)
                    .isTaken(false)
                    .build();

            analyticResearchRepository.save(researcherEntity);
            log.info("Researcher with email: {} registered successfully", researcherDto.getEmail());
        } catch (Exception e) {
            log.error("Error while registering researcher with email: {}", researcherDto.getEmail());
            throw new CustomException(new ResponseMessageDto("Error while registering researcher with email: " + researcherDto.getEmail(), HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<ResearcherDto> getAllResearchers() throws CustomException{
        try{
            log.info("Getting all researchers");
            List<ResearcherEntity> researcherEntities = analyticResearchRepository.findAll();
            List<ResearcherDto> researcherDtos = new ArrayList<>();
            for (ResearcherEntity researcherEntity : researcherEntities) {
                researcherDtos.add(modelMapper.map(researcherEntity, ResearcherDto.class));
            }
            log.info("All researchers retrieved successfully");
            return researcherDtos;
        } catch (Exception e) {
            log.error("Error while getting all researchers" + e.getMessage());
            throw new CustomException(new ResponseMessageDto("Error while getting all researchers", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<ResearcherDto> getAllValidResearchers() throws CustomException{
        try{
            log.info("Getting all valid researchers");
            List<ResearcherEntity> researcherEntities = analyticResearchRepository.findAllByIsValid(true);
            List<ResearcherDto> researcherDtos = new ArrayList<>();

            log.info("Size of researchers: {}", researcherEntities.size());

            for (ResearcherEntity researcherEntity : researcherEntities) {
                researcherDtos.add(modelMapper.map(researcherEntity, ResearcherDto.class));
            }
            log.info("All valid researchers retrieved successfully");
            return researcherDtos;
        } catch (Exception e) {
            log.error("Error while getting all valid researchers" + e.getMessage());
            throw new CustomException(new ResponseMessageDto("Error while getting all valid researchers ?", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public List<ResearcherDto> getAllTakenResearchers() throws CustomException {
        try{
            log.info("Getting all taken researchers");
            List<ResearcherEntity> researcherEntities = analyticResearchRepository.findAllByIsTaken(true);
            List<ResearcherDto> researcherDtos = new ArrayList<>();
            for (ResearcherEntity researcherEntity : researcherEntities) {
                researcherDtos.add(modelMapper.map(researcherEntity, ResearcherDto.class));
            }
            log.info("All taken researchers retrieved successfully: ");
            return researcherDtos;
        } catch (Exception e) {
            log.error("Error while getting all taken researchers");
            throw new CustomException(new ResponseMessageDto("Error while getting all taken researchers", HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public void healthDataToCsv(Long id, String fileName) throws CustomException{
        try{

            Optional<ResearcherEntity> researcher = analyticResearchRepository.findById(id);

            if (researcher.isEmpty() || !researcher.get().getIsValid())
                throw new CustomException(new ResponseMessageDto("Researcher with id: " + id + " does not exist", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);

            List<HealthRecordDto> healthRecordsList = patientServiceFeignClient.getAllHealthRecords().getBody();
            if (healthRecordsList == null)
                throw new CustomException(new ResponseMessageDto("No health records found", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);



            try(CSVWriter csvWriter = new CSVWriter(new FileWriter(new File(fileName)))){
                String[] header = {
                        "Patient ID", "Checkup Date", "Height (cm)", "Weight (kg)", "Blood Pressure",
                        "Blood Sugar", "Body Temperature", "Pulse Rate", "Allergies", "Past Surgeries",
                        "Has Diabetes", "Is Hypertensive", "Has Heart Disease", "Has Kidney Disease",
                        "Has Liver Disease", "Has Cancer", "Has HIV", "Has TB", "Physical Disability",
                        "Vaccine Info", "Is Smoker", "Is Alcoholic", "Is Active"
                };

                csvWriter.writeNext(header);

                for (HealthRecordDto userHealthRecordDto : healthRecordsList){
                    String[] data = {
                            userHealthRecordDto.getPatientId(),
                            String.valueOf(userHealthRecordDto.getCheckupDate()),
                            String.valueOf(userHealthRecordDto.getHeightInCm()),
                            String.valueOf(userHealthRecordDto.getWeightInKg()),
                            String.valueOf(userHealthRecordDto.getBloodPressure()),
                            String.valueOf(userHealthRecordDto.getBloodSugar()),
                            String.valueOf(userHealthRecordDto.getBodyTemperature()),
                            String.valueOf(userHealthRecordDto.getPulseRate()),
                            userHealthRecordDto.getAllergies(),
                            userHealthRecordDto.getPastSurgeries(),
                            String.valueOf(userHealthRecordDto.getHasDiabetes()),
                            String.valueOf(userHealthRecordDto.getIsHypertensive()),
                            String.valueOf(userHealthRecordDto.getHasHeartDisease()),
                            String.valueOf(userHealthRecordDto.getHasKidneyDisease()),
                            String.valueOf(userHealthRecordDto.getHasLiverDisease()),
                            String.valueOf(userHealthRecordDto.getHasCancer()),
                            String.valueOf(userHealthRecordDto.getHasHiv()),
                            String.valueOf(userHealthRecordDto.getHasTb()),
                            userHealthRecordDto.getPhysicalDisability(),
                            userHealthRecordDto.getVaccineInfo(),
                            String.valueOf(userHealthRecordDto.getIsSmoker()),
                            String.valueOf(userHealthRecordDto.getIsAlcoholic()),
                            String.valueOf(userHealthRecordDto.getIsActive())
                    };
                    csvWriter.writeNext(data);
                }
                ResearcherEntity researcherEntity = researcher.get();
                researcherEntity.setIsTaken(true);
                analyticResearchRepository.save(researcherEntity);
            }
            System.out.println(1);

            Map<String, Object> props = new HashMap<>();
            props.put("appName", "HMS System");
            props.put("requestId", researcher.get().getId().toString());
            props.put("recipientName", researcher.get().getName());
            props.put("approvalDate", LocalDate.now().toString());
            props.put("fullName", researcher.get().getName());
            props.put("email", researcher.get().getEmail());
            props.put("designation", researcher.get().getDesignation());
            props.put("institution", researcher.get().getInstitute());
            props.put("accessScope", "All");
            props.put("expiryDate", LocalDate.now().plusDays(30).toString());
            props.put("securityNotes", "None");
            props.put("dataAttribution", "HMS");
            props.put("supportEmail", "support@whodev.top");
            props.put("appWebsite", "whodev.top");
            props.put("year", LocalDate.now().getYear());
            props.put("orgName", "HMS");

            DataMailRequest dataMailRequest = DataMailRequest.builder()
                    .to(researcher.get().getEmail())
                    .content("")
                    .template("researcher.html")
                    .subject("Xác nhận phê duyệt truy cập dữ liệu thành công")
                    .properties(props)
                    .build();
            System.out.println(2);
            Path path = Paths.get(fileName);
            System.out.println(3);
            MultipartFile[] files = new MultipartFile[0];
            if (Files.exists(path)) {
                byte[] bytes = Files.readAllBytes(path);
                MultipartFile csvPart = new MockMultipartFile(
                        "files",
                        path.getFileName().toString(),
                        "text/csv",
                        bytes
                );
                files = new MultipartFile[]{ csvPart };
            }
            System.out.println(4);



            System.out.println("5: about to call notification");


            String dataJson = objectMapper.writeValueAsString(dataMailRequest);

            notificationServiceFeignClient.sendEmailWithAttachment(dataJson, files);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void giveAccessToResearcher(Long id) throws CustomException {
        try {
            if (analyticResearchRepository.findByIdAndIsValidIsFalse(id) == null) {
                log.error("Researcher with id: {} does not exist", id);
                throw new CustomException(new ResponseMessageDto("Researcher with id: " + id + " does not exist", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
            }
            Optional<ResearcherEntity> researcher = analyticResearchRepository.findById(id);
            if (researcher.isEmpty())
                throw new RuntimeException("Researcher is not found");
            ResearcherEntity researcherEntity = researcher.get();
            researcherEntity.setIsValid(true);
            analyticResearchRepository.save(researcherEntity);
        } catch (Exception e) {
            log.error("Error while giving access to researcher with id: {}", id);
            throw new CustomException(new ResponseMessageDto("Error while giving access to researcher with id: " + id, HttpStatus.INTERNAL_SERVER_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
