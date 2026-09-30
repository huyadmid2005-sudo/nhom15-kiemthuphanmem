package com.vuong.communityportalservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDto {
    private Long commentId;
    private String patientId;
    private Long postId;
    private String commentContent;
    private LocalDateTime createdAt;
    private boolean isActive;
}
