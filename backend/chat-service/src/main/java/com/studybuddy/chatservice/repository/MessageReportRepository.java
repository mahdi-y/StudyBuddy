package com.studybuddy.chatservice.repository;

import com.studybuddy.chatservice.model.MessageReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MessageReportRepository extends JpaRepository<MessageReport, Long> {
}