package com.vuong.notificationservice.dto;

import com.vuong.notificationservice.enums.Role;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserDto {
    private Long id;
    private String email;
    private Role role;
}
