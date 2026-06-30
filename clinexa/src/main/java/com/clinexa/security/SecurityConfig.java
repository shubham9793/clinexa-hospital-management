//package com.clinexa.security;
//
//import jakarta.annotation.PostConstruct;
//import lombok.RequiredArgsConstructor;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
//import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//@Configuration
//@EnableMethodSecurity
//@RequiredArgsConstructor
//public class SecurityConfig {
//
//    private final JwtAuthenticationFilter jwtAuthFilter;
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(
//            HttpSecurity http
//    ) throws Exception {
//
//        http
//                .cors(cors -> {})
//                .csrf(csrf -> csrf.disable())
//                .sessionManagement(session ->
//                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                )
//                .authorizeHttpRequests(auth -> auth
//
//                        // Auth APIs
//                        .requestMatchers("/auth/**").permitAll()
//
//                        // Doctors
//                        .requestMatchers(HttpMethod.GET, "/doctors/**").permitAll()
//                        .requestMatchers(HttpMethod.PUT, "/doctors/*/toggle-availability").permitAll()
//
//                        // Departments
//                        .requestMatchers(HttpMethod.GET, "/departments/**").permitAll()
//
//                        // Categories
//                        .requestMatchers(HttpMethod.GET, "/doctor-categories/**").permitAll()
//
//                        // Activities
//                        .requestMatchers(HttpMethod.GET, "/activities/**").permitAll()
//
//                        // Receptionists
//                        .requestMatchers("/receptionists/**").permitAll()
//
//                        // Everything else requires login
//                        .anyRequest().authenticated()
//                )
//                .addFilterBefore(
//                        jwtAuthFilter,
//                        UsernamePasswordAuthenticationFilter.class
//                );
//
//        return http.build();
//    }
//
//    @Bean
//    public AuthenticationManager authenticationManager(
//            AuthenticationConfiguration config
//    ) throws Exception {
//
//        return config.getAuthenticationManager();
//    }
//
//    @PostConstruct
//    public void init() {
//        System.out.println("🔥 SecurityConfig Loaded");
//    }
//}


package com.clinexa.security;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()
                        .requestMatchers("/auth/**")
                        .permitAll()
                        .requestMatchers(
                                HttpMethod.GET,
                                "/user/profile"
                        )
                        .hasAnyAuthority(
                                "ADMIN",
                                "RECEPTIONIST",
                                "PATIENT",
                                "DOCTOR"
                        )
                        // Logged-in users can view doctors
                        .requestMatchers(
                                HttpMethod.GET,
                                "/doctors/**"
                        )
                        .hasAnyAuthority(
                                "ADMIN",
                                "RECEPTIONIST",
                                "PATIENT",
                                "DOCTOR"
                        )
                        // Only Admin manages doctors
                        .requestMatchers(
                                "/doctors/**"
                        )
                        .hasAuthority("ADMIN")
                        .requestMatchers(
                                HttpMethod.GET,
                                "/departments/**"
                        )
                        .hasAnyAuthority(
                                "ADMIN",
                                "RECEPTIONIST",
                                "PATIENT",
                                "DOCTOR"
                        )

                        .requestMatchers(
                                "/departments/**"
                        )
                        .hasAuthority("ADMIN")
                        .requestMatchers(
                                HttpMethod.GET,
                                "/doctor-categories/**"
                        )
                        .hasAnyAuthority(
                                "ADMIN",
                                "RECEPTIONIST",
                                "PATIENT",
                                "DOCTOR"
                        )

                        .requestMatchers(
                                "/doctor-categories/**"
                        )
                        .hasAuthority("ADMIN")

                        .requestMatchers(
                                "/receptionists/**"
                        )
                        .hasAuthority("ADMIN")
                        .requestMatchers(
                                "/patients/**"
                        )
                        .hasAuthority("RECEPTIONIST")
                        .requestMatchers(
                                "/activities/**"
                        )
                        .hasAuthority("ADMIN")
                        .requestMatchers(
                                "/appointments/**"
                        )
                        .hasAnyAuthority(
                                "ADMIN",
                                "RECEPTIONIST",
                                "PATIENT",
                                "DOCTOR"
                        )
                        .requestMatchers(
                                "/medical-records/**"
                        )
                        .hasAnyAuthority(
                                "DOCTOR",
                                "PATIENT",
                                "RECEPTIONIST"
                        )
                        .anyRequest()
                        .denyAll()

                )

                .addFilterBefore(
                        jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }

    @PostConstruct
    public void init() {
        System.out.println("🔥 SecurityConfig Loaded");
    }
}