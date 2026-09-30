package com.vuong.cdssservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "recommendation_items")
public class RecommendationItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "recommendation_id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_recommendation_item_recommendation")
    )
    private Recommendation recommendation;

    @Column(name = "medical_id", nullable = false)
    private Long medicalId;

    @Column(name = "frequency", nullable = false)
    private String frequency;

}
