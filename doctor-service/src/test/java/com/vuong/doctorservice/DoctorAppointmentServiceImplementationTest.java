package com.vuong.doctorservice;

import com.vuong.doctorservice.dto.AppointmentSlotRequestDto;
import com.vuong.doctorservice.dto.BookAppointmentRequestDto;
import com.vuong.doctorservice.dto.DoctorDto;
import com.vuong.doctorservice.dto.NotificationDto;
import com.vuong.doctorservice.dto.PatientDto;
import com.vuong.doctorservice.entitiy.AppointmentEntity;
import com.vuong.doctorservice.entitiy.DoctorAvailabilityEntity;
import com.vuong.doctorservice.entitiy.DoctorEntity;
import com.vuong.doctorservice.enums.AppointmentStatus;
import com.vuong.doctorservice.enums.AppointmentType;
import com.vuong.doctorservice.exception.CustomException;
import com.vuong.doctorservice.networkmanager.NotificationServiceFeignClient;
import com.vuong.doctorservice.networkmanager.PatientServiceFeignClient;
import com.vuong.doctorservice.repository.DoctorAppointmentRepository;
import com.vuong.doctorservice.repository.DoctorAvailabilityRepository;
import com.vuong.doctorservice.service.DoctorService;
import com.vuong.doctorservice.service.implementation.DoctorAppointmentServiceImplementation;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoctorAppointmentServiceImplementationTest {

    private static final String DOCTOR_ID = "DOC-1";
    private static final String PATIENT_ID = "PAT-1";

    @Mock
    private DoctorAvailabilityRepository doctorAvailabilityRepository;

    @Mock
    private DoctorAppointmentRepository doctorAppointmentRepository;

    @Mock
    private DoctorService doctorService;

    @Mock
    private ModelMapper modelMapper;

    @Mock
    private PatientServiceFeignClient patientServiceFeignClient;

    @Mock
    private NotificationServiceFeignClient notificationServiceFeignClient;

    @InjectMocks
    private DoctorAppointmentServiceImplementation doctorAppointmentService;

    @Test
    void createAppointmentSlotCreatesSlotsForEachPatientWindow() throws CustomException {
        LocalDate date = LocalDate.now().plusDays(1);
        AppointmentSlotRequestDto request = new AppointmentSlotRequestDto(
                date,
                LocalTime.of(9, 0),
                LocalTime.of(10, 0),
                20L
        );
        DoctorDto doctorDto = doctorDto();
        DoctorEntity doctor = doctorEntity();

        when(doctorService.getCurrentDoctor()).thenReturn(doctorDto);
        when(doctorAvailabilityRepository.findByDoctorIdAndDate(DOCTOR_ID, date)).thenReturn(List.of());
        when(modelMapper.map(doctorDto, DoctorEntity.class)).thenReturn(doctor);

        doctorAppointmentService.createAppointmentSlot(request);

        @SuppressWarnings("unchecked")
        ArgumentCaptor<List<DoctorAvailabilityEntity>> slotsCaptor = ArgumentCaptor.forClass(List.class);
        verify(doctorAvailabilityRepository).saveAll(slotsCaptor.capture());

        List<DoctorAvailabilityEntity> slots = slotsCaptor.getValue();
        assertThat(slots).hasSize(3);
        assertThat(slots).extracting(DoctorAvailabilityEntity::getStartTime)
                .containsExactly(LocalTime.of(9, 0), LocalTime.of(9, 20), LocalTime.of(9, 40));
        assertThat(slots).extracting(DoctorAvailabilityEntity::getEndTime)
                .containsExactly(LocalTime.of(9, 20), LocalTime.of(9, 40), LocalTime.of(10, 0));
        assertThat(slots).allSatisfy(slot -> {
            assertThat(slot.getDoctor()).isSameAs(doctor);
            assertThat(slot.getDate()).isEqualTo(date);
            assertThat(slot.getIsAvailable()).isTrue();
        });
    }

    @Test
    void createAppointmentSlotThrowsWhenSlotOverlapsExistingSlot() throws CustomException {
        LocalDate date = LocalDate.now().plusDays(1);
        AppointmentSlotRequestDto request = new AppointmentSlotRequestDto(
                date,
                LocalTime.of(9, 0),
                LocalTime.of(10, 0),
                30L
        );

        when(doctorService.getCurrentDoctor()).thenReturn(doctorDto());
        when(doctorAvailabilityRepository.findByDoctorIdAndDate(DOCTOR_ID, date))
                .thenReturn(List.of(availabilitySlot(date, LocalTime.of(9, 30), LocalTime.of(10, 0), true)));

        assertThatThrownBy(() -> doctorAppointmentService.createAppointmentSlot(request))
                .isInstanceOf(CustomException.class)
                .hasMessage("Time slot for appointment overlaps with existing slot");

        verify(doctorAvailabilityRepository, never()).saveAll(any());
    }

    @Test
    void createAppointmentSlotThrowsWhenDateIsInPast() throws CustomException {
        LocalDate date = LocalDate.now().minusDays(1);
        AppointmentSlotRequestDto request = new AppointmentSlotRequestDto(
                date,
                LocalTime.of(9, 0),
                LocalTime.of(10, 0),
                30L
        );
        DoctorDto doctorDto = doctorDto();

        when(doctorService.getCurrentDoctor()).thenReturn(doctorDto);
        when(doctorAvailabilityRepository.findByDoctorIdAndDate(DOCTOR_ID, date)).thenReturn(List.of());
        when(modelMapper.map(doctorDto, DoctorEntity.class)).thenReturn(doctorEntity());

        assertThatThrownBy(() -> doctorAppointmentService.createAppointmentSlot(request))
                .isInstanceOf(CustomException.class)
                .hasMessage("Date cannot be earlier than today");

        verify(doctorAvailabilityRepository, never()).saveAll(any());
    }

    @Test
    void createAppointmentSlotThrowsWhenPerPatientTimeExceedsWindow() throws CustomException {
        LocalDate date = LocalDate.now().plusDays(1);
        AppointmentSlotRequestDto request = new AppointmentSlotRequestDto(
                date,
                LocalTime.of(9, 0),
                LocalTime.of(9, 30),
                45L
        );
        DoctorDto doctorDto = doctorDto();

        when(doctorService.getCurrentDoctor()).thenReturn(doctorDto);
        when(doctorAvailabilityRepository.findByDoctorIdAndDate(DOCTOR_ID, date)).thenReturn(List.of());
        when(modelMapper.map(doctorDto, DoctorEntity.class)).thenReturn(doctorEntity());

        assertThatThrownBy(() -> doctorAppointmentService.createAppointmentSlot(request))
                .isInstanceOf(CustomException.class)
                .hasMessage("Per patient time exceeds the slot window");

        verify(doctorAvailabilityRepository, never()).saveAll(any());
    }

    @Test
    void bookAppointmentSlotBooksAvailableSlotAndSendsNotification() throws CustomException {
        LocalDate date = LocalDate.now().plusDays(1);
        BookAppointmentRequestDto request = new BookAppointmentRequestDto(
                10L,
                PATIENT_ID,
                AppointmentType.In_Person,
                AppointmentStatus.Booked
        );
        DoctorAvailabilityEntity slot = availabilitySlot(date, LocalTime.of(9, 0), LocalTime.of(9, 30), true);

        when(patientServiceFeignClient.getPatientById(PATIENT_ID)).thenReturn(ResponseEntity.ok(activePatient()));
        when(doctorAvailabilityRepository.findById(10L)).thenReturn(Optional.of(slot));
        when(doctorAppointmentRepository.existsByPatientIdAndDoctorAndDate(PATIENT_ID, DOCTOR_ID, date))
                .thenReturn(false);

        doctorAppointmentService.bookAppointmentSlot(request);

        ArgumentCaptor<DoctorAvailabilityEntity> slotCaptor = ArgumentCaptor.forClass(DoctorAvailabilityEntity.class);
        verify(doctorAvailabilityRepository).save(slotCaptor.capture());
        assertThat(slotCaptor.getValue().getIsAvailable()).isFalse();

        ArgumentCaptor<AppointmentEntity> appointmentCaptor = ArgumentCaptor.forClass(AppointmentEntity.class);
        verify(doctorAppointmentRepository).save(appointmentCaptor.capture());
        AppointmentEntity appointment = appointmentCaptor.getValue();
        assertThat(appointment.getDoctor()).isSameAs(slot.getDoctor());
        assertThat(appointment.getDoctorAvailability()).isSameAs(slot);
        assertThat(appointment.getPatientId()).isEqualTo(PATIENT_ID);
        assertThat(appointment.getAppointmentType()).isEqualTo(AppointmentType.In_Person);
        assertThat(appointment.getAppointmentStatus()).isEqualTo(AppointmentStatus.Booked);
        assertThat(appointment.getIsActive()).isTrue();

        ArgumentCaptor<NotificationDto> notificationCaptor = ArgumentCaptor.forClass(NotificationDto.class);
        verify(notificationServiceFeignClient).createNotification(notificationCaptor.capture());
        NotificationDto notification = notificationCaptor.getValue();
        assertThat(notification.getUserId()).isEqualTo(100L);
        assertThat(notification.getNotificationType()).isEqualTo("Book Appointment");
        assertThat(notification.getNotificationText()).contains("Dr. John Smith");
        assertThat(notification.getTimestamp()).isNotNull();
        assertThat(notification.getIsRead()).isFalse();
    }

    @Test
    void bookAppointmentSlotThrowsWhenPatientNotFound() {
        BookAppointmentRequestDto request = new BookAppointmentRequestDto(
                10L,
                PATIENT_ID,
                AppointmentType.In_Person,
                AppointmentStatus.Booked
        );

        when(patientServiceFeignClient.getPatientById(PATIENT_ID))
                .thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND).build());

        assertThatThrownBy(() -> doctorAppointmentService.bookAppointmentSlot(request))
                .isInstanceOf(CustomException.class)
                .hasMessage("Patient not found");

        verify(doctorAvailabilityRepository, never()).findById(any());
        verify(doctorAppointmentRepository, never()).save(any());
    }

    @Test
    void bookAppointmentSlotThrowsWhenSlotIsUnavailable() {
        BookAppointmentRequestDto request = new BookAppointmentRequestDto(
                10L,
                PATIENT_ID,
                AppointmentType.In_Person,
                AppointmentStatus.Booked
        );

        when(patientServiceFeignClient.getPatientById(PATIENT_ID)).thenReturn(ResponseEntity.ok(activePatient()));
        when(doctorAvailabilityRepository.findById(10L))
                .thenReturn(Optional.of(availabilitySlot(LocalDate.now().plusDays(1), LocalTime.of(9, 0), LocalTime.of(9, 30), false)));

        assertThatThrownBy(() -> doctorAppointmentService.bookAppointmentSlot(request))
                .isInstanceOf(CustomException.class)
                .hasMessage("Appointment slot not available");

        verify(doctorAppointmentRepository, never()).existsByPatientIdAndDoctorAndDate(any(), any(), any());
        verify(doctorAvailabilityRepository, never()).save(any());
        verify(doctorAppointmentRepository, never()).save(any());
    }

    @Test
    void bookAppointmentSlotThrowsWhenPatientAlreadyBookedSameDoctorOnSameDay() {
        LocalDate date = LocalDate.now().plusDays(1);
        BookAppointmentRequestDto request = new BookAppointmentRequestDto(
                10L,
                PATIENT_ID,
                AppointmentType.In_Person,
                AppointmentStatus.Booked
        );

        when(patientServiceFeignClient.getPatientById(PATIENT_ID)).thenReturn(ResponseEntity.ok(activePatient()));
        when(doctorAvailabilityRepository.findById(10L))
                .thenReturn(Optional.of(availabilitySlot(date, LocalTime.of(9, 0), LocalTime.of(9, 30), true)));
        when(doctorAppointmentRepository.existsByPatientIdAndDoctorAndDate(PATIENT_ID, DOCTOR_ID, date))
                .thenReturn(true);

        assertThatThrownBy(() -> doctorAppointmentService.bookAppointmentSlot(request))
                .isInstanceOf(CustomException.class)
                .hasMessage("Appointment already booked with this doctor on the same day");

        verify(doctorAvailabilityRepository, never()).save(any());
        verify(doctorAppointmentRepository, never()).save(any());
        verify(notificationServiceFeignClient, never()).createNotification(any());
    }

    private DoctorDto doctorDto() {
        DoctorDto doctorDto = new DoctorDto();
        doctorDto.setDoctorId(DOCTOR_ID);
        doctorDto.setFirstName("John");
        doctorDto.setLastName("Smith");
        return doctorDto;
    }

    private DoctorEntity doctorEntity() {
        DoctorEntity doctor = new DoctorEntity();
        doctor.setDoctorId(DOCTOR_ID);
        doctor.setFirstName("John");
        doctor.setLastName("Smith");
        return doctor;
    }

    private DoctorAvailabilityEntity availabilitySlot(
            LocalDate date,
            LocalTime startTime,
            LocalTime endTime,
            boolean isAvailable
    ) {
        DoctorAvailabilityEntity slot = new DoctorAvailabilityEntity();
        slot.setAvailabilityId(10L);
        slot.setDoctor(doctorEntity());
        slot.setDate(date);
        slot.setStartTime(startTime);
        slot.setEndTime(endTime);
        slot.setIsAvailable(isAvailable);
        return slot;
    }

    private PatientDto activePatient() {
        PatientDto patient = new PatientDto();
        patient.setPatientId(PATIENT_ID);
        patient.setUserId(100L);
        patient.setActive(true);
        return patient;
    }
}
