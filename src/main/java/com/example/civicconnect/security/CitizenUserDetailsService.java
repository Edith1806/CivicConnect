package com.example.civicconnect.security;

import com.example.civicconnect.entity.Citizen;
import com.example.civicconnect.repository.CitizenRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CitizenUserDetailsService implements UserDetailsService {

    private final CitizenRepository citizenRepository;

    public CitizenUserDetailsService(CitizenRepository citizenRepository) {
        this.citizenRepository = citizenRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        return citizenRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("Citizen not found with email: " + email)
                );
    }
}
