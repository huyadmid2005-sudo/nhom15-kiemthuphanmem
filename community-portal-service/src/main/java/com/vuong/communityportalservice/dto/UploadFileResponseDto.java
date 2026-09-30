package com.vuong.communityportalservice.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UploadFileResponseDto {
    private String fileName;
    private String fileType;
    private String filePath;
    private Long fileSize;
    private String fileUrl;
}
