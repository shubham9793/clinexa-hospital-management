package com.clinexa.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET =
            "Y2xpbmV4YXNlY3JldGtleWNsaW5leGFzZWNyZXRrZXkxMjM0NTY=";

    private final SecretKey key =
            Keys.hmacShaKeyFor(
                    Decoders.BASE64.decode(SECRET)
            );

    // GENERATE TOKEN

    public String generateToken(
            String email
    ) {

        return Jwts.builder()

                .subject(email)

                .issuedAt(new Date())

                .expiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 1000L * 60 * 60 * 24 * 7
                        )
                )

                .signWith(key)

                .compact();
    }

    // EXTRACT EMAIL

    public String extractEmail(
            String token
    ) {

        return extractAllClaims(token)
                .getSubject();
    }

    // VALIDATE TOKEN

    public boolean isTokenValid(
            String token,
            String email
    ) {

        final String extractedEmail =
                extractEmail(token);

        return extractedEmail.equals(email)
                && !isTokenExpired(token);
    }

    // CHECK EXPIRATION

    private boolean isTokenExpired(
            String token
    ) {

        return extractExpiration(token)
                .before(new Date());
    }

    // EXTRACT EXPIRATION

    private Date extractExpiration(
            String token
    ) {

        return extractAllClaims(token)
                .getExpiration();
    }

    // EXTRACT CLAIMS

    private Claims extractAllClaims(
            String token
    ) {

        return Jwts.parser()

                .verifyWith(key)

                .build()

                .parseSignedClaims(token)

                .getPayload();
    }
}