package com.pampam.brainy_bite.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pampam.brainy_bite.models.RoleAuth;
import com.pampam.brainy_bite.models.ERole;

@Repository
public interface RoleAuthRepositiry extends JpaRepository<RoleAuth, Long>{
    Optional<RoleAuth> findByName(ERole name);
}
