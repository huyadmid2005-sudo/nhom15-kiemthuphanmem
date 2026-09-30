package com.vuong.communityportalservice.repository;

import com.vuong.communityportalservice.entity.ArticleEntity;
import com.vuong.communityportalservice.enums.ArticleCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleEntity, Long> {

    List<ArticleEntity> findByIsActiveTrueOrderByCreatedAtDesc();

    List<ArticleEntity> findByDoctorIdAndIsActiveTrueOrderByCreatedAtDesc(String doctorId);

    List<ArticleEntity> findByCategoryAndIsActiveTrueOrderByCreatedAtDesc(ArticleCategory category);

    Optional<ArticleEntity> findByArticleIdAndIsActiveTrue(Long articleId);

    @Query("SELECT a FROM ArticleEntity a WHERE a.isActive = true AND " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY a.createdAt DESC")
    List<ArticleEntity> searchByKeyword(@Param("keyword") String keyword);
}
