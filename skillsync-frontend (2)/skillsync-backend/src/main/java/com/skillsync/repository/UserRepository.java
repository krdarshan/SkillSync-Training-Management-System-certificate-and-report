package com.skillsync.repository;

import com.skillsync.entity.User;
import com.skillsync.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(UserRole role);
    
    Optional<User> findByEmailAndPassword(String email, String password);
    
    List<User> findByDepartment(String department);
} 