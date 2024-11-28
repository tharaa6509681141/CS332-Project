package com.pampam.brainy_bite.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pampam.brainy_bite.models.UserAuth;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, Long>{
    Optional<UserAuth> findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existByEmail(String email);
}
