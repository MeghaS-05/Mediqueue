package com.mediqueue.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    // these paths skip JWT check entirely
    private static final List<String> PUBLIC_PATHS = List.of(
        "/api/auth/login",
        "/api/auth/register",
        "/actuator",
        "/ws",
        "/error"
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        // skip JWT filter for public paths
        return PUBLIC_PATHS.stream().anyMatch(path::startsWith);
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // no token — continue without authentication
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String jwt = authHeader.substring(7);
        String userEmail = null;

        try {
            userEmail = jwtUtil.extractUsername(jwt);
        } catch (Exception e) {
            // bad token — just continue, security config will block if needed
            filterChain.doFilter(request, response);
            return;
        }

        if (userEmail != null
                && SecurityContextHolder.getContext()
                                        .getAuthentication() == null) {
            try {
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(userEmail);

                if (jwtUtil.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );
                    SecurityContextHolder.getContext()
                                        .setAuthentication(authToken);
                }
            } catch (Exception e) {
                // user not found or token invalid — continue unauthenticated
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}