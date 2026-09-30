package com.vuong.communityportalservice.repository;

import com.vuong.communityportalservice.entity.ArticleLikeEntity;
import com.vuong.communityportalservice.enums.ArticleActorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleLikeRepository extends JpaRepository<ArticleLikeEntity, Long> {

    Optional<ArticleLikeEntity> findByArticleIdAndActorIdAndActorType(
            Long articleId, String actorId, ArticleActorType actorType);

    long countByArticleId(Long articleId);

    boolean existsByArticleIdAndActorIdAndActorType(
            Long articleId, String actorId, ArticleActorType actorType);
}
