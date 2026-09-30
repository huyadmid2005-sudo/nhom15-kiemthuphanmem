package com.vuong.communityportalservice.dto;

import com.vuong.communityportalservice.enums.ArticleCategory;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleDto {
    private Long articleId;
    private String doctorId;
    private String doctorName;
    private String doctorDepartment;
    private String title;
    private String content;
    private ArticleCategory category;
    private String thumbnailUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isActive;
    private long likeCount;
    private boolean likedByCurrentUser;
    private boolean bookmarkedByCurrentUser;
    private long commentCount;
}
