package com.myclass.chat_app.repository;

import com.myclass.chat_app.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByGroupId(Long groupId);
    Optional<GroupMember> findByGroupIdAndUserEmailIgnoreCase(Long groupId, String email);
    List<GroupMember> findByUserEmailIgnoreCase(String email);
}

