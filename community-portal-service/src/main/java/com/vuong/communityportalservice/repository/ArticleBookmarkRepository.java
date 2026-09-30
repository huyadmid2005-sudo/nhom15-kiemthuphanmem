package com.vuong.communityportalservice.repository;

import com.vuong.communityportalservice.entity.ArticleBookmarkEntity;
import com.vuong.communityportalservice.enums.ArticleActorType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleBookmarkRepository extends JpaRepository<ArticleBookmarkEntity, Long> {

    List<ArticleBookmarkEntity> findByActorIdAndActorTypeOrderByCreatedAtDesc(
            String actorId, ArticleActorType actorType);

    Optional<ArticleBookmarkEntity> findByArticleIdAndActorIdAndActorType(
            Long articleId, String actorId, ArticleActorType actorType);

    boolean existsByArticleIdAndActorIdAndActorType(
            Long articleId, String actorId, ArticleActorType actorType);
}
