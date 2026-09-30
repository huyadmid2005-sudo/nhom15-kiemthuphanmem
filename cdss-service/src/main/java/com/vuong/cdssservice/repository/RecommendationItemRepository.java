package com.vuong.cdssservice.repository;

import com.vuong.cdssservice.entity.RecommendationItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationItemRepository extends JpaRepository<RecommendationItem, Long> {
}
