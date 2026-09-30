package com.vuong.communityportalservice.repository;

import com.vuong.communityportalservice.entity.ArticleCommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleCommentRepository extends JpaRepository<ArticleCommentEntity, Long> {

    List<ArticleCommentEntity> findByArticleIdAndIsActiveTrueOrderByCreatedAtDesc(Long articleId);
}
