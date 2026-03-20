package com.myclass.chat_app.repository;

import com.myclass.chat_app.entity.LocalCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LocalCredentialRepository extends JpaRepository<LocalCredential, Long> {
    Optional<LocalCredential> findByUserEmailIgnoreCase(String email);
    boolean existsByUserEmailIgnoreCase(String email);
}
