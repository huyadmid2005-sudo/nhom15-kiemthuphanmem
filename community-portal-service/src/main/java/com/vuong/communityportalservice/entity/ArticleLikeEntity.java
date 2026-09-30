package com.vuong.communityportalservice.entity;

import com.vuong.communityportalservice.enums.ArticleActorType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "article_likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"article_id", "patient_id"})
})
public class ArticleLikeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    private Long likeId;

    @Column(name = "article_id", nullable = false)
    private Long articleId;

    @Column(name = "patient_id", nullable = false)
    private String actorId;

    @Enumerated(EnumType.STRING)
    @Column(name = "actor_type", nullable = false, length = 20)
    private ArticleActorType actorType;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
