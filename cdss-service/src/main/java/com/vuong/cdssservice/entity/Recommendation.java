package com.vuong.cdssservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "recommendations")
public class Recommendation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id")
    private String patientId;

    @Column(name = "doctor_id")
    private String doctorId;

    @Column(name = "recommendation_message")
    private String recommendationMessage;

    @OneToMany(
            mappedBy = "recommendation",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RecommendationItem> items = new ArrayList<>();;

    @Column(name = "created_at")
    private LocalDate createdAt;

    @Column(name = "reschedule_appointment")
    private LocalDate rescheduleAppointment;

    public void addItem(RecommendationItem item) {
        items.add(item);
        item.setRecommendation(this);
    }

    public void removeItem(RecommendationItem item) {
        items.remove(item);
        item.setRecommendation(null);
    }
}
