package com.vuong.communityportalservice.dto;

import com.vuong.communityportalservice.enums.ArticleActorType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ArticleActorDto {
    private String actorId;
    private String actorName;
    private ArticleActorType actorType;
}
