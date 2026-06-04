package com.clinexa.auth;


import com.clinexa.User.User;
import com.clinexa.auth.dto.AuthResponse;
import com.clinexa.role.Role;
import com.clinexa.role.RoleRepository;
import com.clinexa.User.UserRepository;
import com.clinexa.auth.dto.LoginRequest;
import com.clinexa.auth.dto.RegisterRequest;
import com.clinexa.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final RoleRepository roleRepository;



    public String register(RegisterRequest request) {

        Role patientRole = roleRepository
                .findByName("PATIENT")
                .orElseThrow();

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(patientRole)
                .build();

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {
            throw new RuntimeException("Invalid Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().getName())
                .build();
    }
}