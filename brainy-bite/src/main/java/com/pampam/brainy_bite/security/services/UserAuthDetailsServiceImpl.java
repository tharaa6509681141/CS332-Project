package com.pampam.brainy_bite.security.services;

import com.pampam.brainy_bite.models.UserAuth;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pampam.brainy_bite.repository.UserAuthRepository;

@Service
public class UserAuthDetailsServiceImpl implements UserDetailsService{
    @Autowired
    UserAuthRepository userAuthRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAuth userAuth = userAuthRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        return UserAuthDetailsImpl.build(userAuth);
    }
}
