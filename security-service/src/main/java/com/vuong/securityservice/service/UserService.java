package com.vuong.securityservice.service;

import com.vuong.securityservice.dto.UserDto;
import com.vuong.securityservice.dto.UserRegistrationRequestDto;
import com.vuong.securityservice.exception.CustomException;

public interface UserService {
    UserDto createUser(UserRegistrationRequestDto userDto) throws CustomException;
    UserDto getUserById(Long id) throws CustomException;
    UserDto getUserByEmail(String email) throws CustomException;
    UserDto updateUser(UserRegistrationRequestDto userDto);
    void deleteUserById(Long id) throws CustomException;
}
