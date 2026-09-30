package com.vuong.securityservice.controller;

import com.vuong.securityservice.constants.AppConstants;
import com.vuong.securityservice.dto.*;
import com.vuong.securityservice.entity.UserEntity;
import com.vuong.securityservice.exception.CustomException;
import com.vuong.securityservice.repository.UserRepository;
import com.vuong.securityservice.service.RecoveryService;
import com.vuong.securityservice.service.UserService;
import com.vuong.securityservice.utils.JwtUtils;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private RecoveryService recoveryService;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<UserRegistrationResponseDto> register(@Valid @RequestBody UserRegistrationRequestDto userDto)
            throws CustomException{
        log.info("Inside register method of UserController");
        UserDto responseUser = userService.createUser(userDto);
        UserRegistrationResponseDto userRegistrationResponse = new UserRegistrationResponseDto(
                "User registered successfully", HttpStatus.CREATED, responseUser);

        return new ResponseEntity<>(userRegistrationResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponseDto> login(@RequestBody UserLoginRequestDto userLoginRequestDto)
            throws CustomException{
        log.info("Inside register method of UserController");
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userLoginRequestDto.getEmail(), userLoginRequestDto.getPassword())
        );
        UserDto userDto = userService.getUserByEmail(userLoginRequestDto.getEmail());

        UserEntity user = userRepository.findUserByEmail(userLoginRequestDto.getEmail())
                .orElseThrow(() -> new CustomException(new ResponseMessageDto("No user found with email: " + userLoginRequestDto.getEmail(), HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST));

        if (!user.isActive()) {
            throw new CustomException(new ResponseMessageDto("User is not active, wait or contact admin for activation", HttpStatus.BAD_REQUEST), HttpStatus.BAD_REQUEST);
        }


        List<String> userRoles = new ArrayList<>();
        userRoles.add(String.valueOf(userDto.getRole()));

        String accessToken = JwtUtils.generateToken(userDto.getEmail(), userRoles);

        UserLoginDetailsDto responseDto = new UserLoginDetailsDto(
                userDto.getId(),
                userDto.getEmail(),
                userDto.getRole(),
                AppConstants.TOKEN_PREFIX + accessToken
        );

        UserLoginResponseDto loginResponseDto = new UserLoginResponseDto(
                "Login successful", HttpStatus.OK, responseDto);

        return new ResponseEntity<>(loginResponseDto, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ResponseMessageDto> deleteUser(@PathVariable Long id)
            throws CustomException{
        log.info("Received request to delete user with ID: {}", id);
        userService.deleteUserById(id);

        ResponseMessageDto responseMessageDto = new ResponseMessageDto("User deleted successfully", HttpStatus.OK);
        return new ResponseEntity<>(responseMessageDto, HttpStatus.OK);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id)
            throws CustomException{
        log.info("Received request to get user with ID: {}", id);
        UserDto userDto = userService.getUserById(id);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @PostMapping("/recovery/{email}")
    public ResponseEntity<?> recoveryAccount(@PathVariable String email) throws CustomException{
        log.info("Received request to recovery user with email: {}", email);
        return new ResponseEntity<>(recoveryService.sendMail(email), HttpStatus.OK);
    }

    @PostMapping("/recovery/verify")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeDto verifyCodeDto) throws CustomException{
        log.info("Received request to verify user with email: {}", verifyCodeDto.getEmail());
        return new ResponseEntity<>(recoveryService.verifyCode(verifyCodeDto), HttpStatus.OK);
    }
}
