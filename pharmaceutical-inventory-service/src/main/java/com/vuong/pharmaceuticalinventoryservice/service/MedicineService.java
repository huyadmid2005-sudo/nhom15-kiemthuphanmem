package com.vuong.pharmaceuticalinventoryservice.service;

import com.vuong.pharmaceuticalinventoryservice.dto.MedicineDto;
import com.vuong.pharmaceuticalinventoryservice.dto.ResponseMessageDto;
import com.vuong.pharmaceuticalinventoryservice.exception.CustomException;

import java.util.List;

public interface MedicineService {
    void createMedicine(MedicineDto medicineDto) throws CustomException;
    void updateMedicine(MedicineDto medicineDto) throws CustomException;
    void deleteMedicine(Long id) throws CustomException;
    MedicineDto getMedicine(Long id) throws CustomException;
    List<MedicineDto> getAllMedicines() throws CustomException;
    ResponseMessageDto bookMedicine(Long medicineId, String patientId) throws CustomException;
    ResponseMessageDto returnMedicine(Long medicineId, String patientId) throws CustomException;
    List<MedicineDto> searchMedicineByName(String name) throws CustomException;
    List<MedicineDto> searchMedicineByManufacturer(String manufacturer) throws CustomException;
    List<MedicineDto> searchMedicineByGenericName(String genericName) throws CustomException;
    List<MedicineDto> alertMedicineExpiry() throws CustomException;
}
