package com.vuong.analyticresearchservice.controller;

import com.vuong.analyticresearchservice.dto.ResearcherDto;
import com.vuong.analyticresearchservice.dto.ResponseMessageDto;
import com.vuong.analyticresearchservice.exception.CustomException;
import com.vuong.analyticresearchservice.networkmanager.NotificationServiceFeignClient;
import com.vuong.analyticresearchservice.service.ResearcherService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Controller
@Slf4j
@RequestMapping("/research")
public class ResearchController {

    @Autowired
    private ResearcherService researcherService;

    @Autowired
    private NotificationServiceFeignClient notificationServiceFeignClient;

    @PostMapping("/register")
    public ResponseEntity<ResponseMessageDto> registerResearcher(@RequestBody ResearcherDto researcherDto)
            throws CustomException {
        log.info("Inside registerResearcher method of ResearchController");
        researcherService.registerResearcher(researcherDto);
        return new ResponseEntity<>(new ResponseMessageDto("Researcher registered successfully", HttpStatus.CREATED), HttpStatus.CREATED);
    }

    @GetMapping("/applied/all")
    public ResponseEntity<?> getAllValidResearchers()
            throws CustomException {
        log.info("Inside getAllValidResearchers method of ResearchController");
        return new ResponseEntity<>(researcherService.getAllValidResearchers(), HttpStatus.OK);
    }

    @GetMapping("/registered/all")
    public ResponseEntity<?> getAllResearchers()
            throws CustomException {
        log.info("Inside getAllResearchers method of ResearchController");
       ;
        return new ResponseEntity<>(researcherService.getAllResearchers(), HttpStatus.CREATED);
    }

    @GetMapping("/taken/all")
    public ResponseEntity<?> getAllTakenResearchers()
            throws CustomException {
        log.info("Inside getAllTakenResearchers method of ResearchController");

        return new ResponseEntity<>(researcherService.getAllTakenResearchers(), HttpStatus.CREATED);
    }

    @GetMapping("/get/analytic-data/{id}")
    public ResponseEntity<ByteArrayResource> healthDataToCsv(@PathVariable("id") Long id)
            throws CustomException {
        String filename = "user_health_data-research.csv";
        researcherService.healthDataToCsv(id, filename);

        try{
            byte[] csvData = Files.readAllBytes(Paths.get(filename));
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", filename);

            ByteArrayResource resource = new ByteArrayResource(csvData);


            return ResponseEntity.ok()
                    .headers(headers)
                    .contentLength(csvData.length)
                    .body(resource);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @GetMapping("/give-access/{id}")
    public ResponseEntity<ResponseMessageDto> giveAccessToResearcher(@PathVariable("id") Long id)
            throws CustomException {
        log.info("Inside giveAccessToResearcher method of ResearchController");
        researcherService.giveAccessToResearcher(id);
        return new ResponseEntity<>(new ResponseMessageDto("Access granted and research data email sent successfully!", HttpStatus.OK), HttpStatus.OK);
    }
}
