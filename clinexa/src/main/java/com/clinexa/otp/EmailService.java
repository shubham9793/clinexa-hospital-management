package com.clinexa.otp;

import com.clinexa.otp.dto.OtpPurpose;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp, OtpPurpose purpose) {
        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("Clinexa Email Verification OTP");

            helper.setText(buildOtpEmail(otp), true);

            mailSender.send(message);

        } catch (Exception ex) {
            throw new RuntimeException("Unable to send OTP email.");
        }
    }

    private String buildOtpEmail(String otp) {
        return """
                <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:30px;">
                    <div style="max-width:520px; margin:auto; background:white; border-radius:18px; padding:30px; box-shadow:0 10px 30px rgba(15,23,42,.12);">
                        <h1 style="color:#0891b2; margin:0;">🏥 Clinexa</h1>

                        <h2 style="color:#0f172a;">Verify Your Email Address</h2>

                        <p style="color:#475569; font-size:15px;">
                            Welcome to Clinexa. Please use the OTP below to verify your email address.
                        </p>

                        <div style="text-align:center; margin:28px 0;">
                            <div style="display:inline-block; letter-spacing:8px; font-size:32px; font-weight:800; color:#0f766e; background:#ecfeff; padding:18px 28px; border-radius:14px;">
                                %s
                            </div>
                        </div>

                        <p style="color:#64748b;">
                            This OTP is valid for <b>5 minutes</b>.
                        </p>

                        <p style="color:#64748b;">
                            If you did not request this, please ignore this email.
                        </p>

                        <hr style="border:none; border-top:1px solid #e2e8f0; margin:24px 0;" />

                        <p style="color:#94a3b8; font-size:13px;">
                            Regards,<br/>
                            Clinexa Team
                        </p>
                    </div>
                </div>
                """.formatted(otp);
    }
}