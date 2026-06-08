package com.mediqueue.security;

import com.mediqueue.model.User;
import com.mediqueue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        // find user in database by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + email));

        // return Spring Security's UserDetails object
        // this is what Spring uses internally to check roles and permissions
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword() != null ? user.getPassword() : "")
                .authorities(List.of(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                        // stores as "ROLE_PATIENT", "ROLE_DOCTOR", "ROLE_ADMIN"
                ))
                .build();
    }
}
