import nodemailer from "nodemailer"
import config from "../config/env";

// object shape that defines what data is required when sending an email
interface SendEmailOptions {
    to: string
    subject: string
    html: string
}

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT),
  secure: false,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
    await transporter.sendMail({
        from: `"Pharmacare" <${config.SMTP_USER}>`,
        to,
        subject,
        html,
    })
}

export const buildVerificationEmail = (name: string, verifyUrl: string): string => `
  <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #3B6D11; font-size: 24px; font-weight: 700; margin: 0;">Pharmacare</h1>
      <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0;">Your trusted pharmacy management system</p>
    </div>
 
    <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 8px;">Verify your email address</h2>
    <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
      Hi <strong>${name}</strong>, welcome to Pharmacare! Click the button below to verify your email and activate your account.
    </p>
 
    <div style="text-align: center; margin: 32px 0;">
      <a href="${verifyUrl}"
         style="display: inline-block; background: #3B6D11; color: #ffffff; text-decoration: none;
                font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px;">
        Verify Email Address
      </a>
    </div>
 
    <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
      Or copy and paste this link into your browser:
    </p>
    <p style="color: #3B6D11; font-size: 13px; word-break: break-all; margin: 0 0 24px;">
      ${verifyUrl}
    </p>
 
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      This link expires in <strong>24 hours</strong>. If you didn't create an account, you can safely ignore this email.
    </p>
  </div>
`;

export const buildWelcomeEmail = (name: string): string => `
  <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="color: #3B6D11; font-size: 24px; font-weight: 700; margin: 0;">Pharmacare</h1>
    </div>
    <h2 style="color: #111827; font-size: 20px; font-weight: 600;">Account Activated 🎉</h2>
    <p style="color: #374151; font-size: 15px; line-height: 1.6;">
      Hi <strong>${name}</strong>, your email has been verified and your account is now active. You can log in anytime.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${config.CLIENT_URL}/login"
         style="display: inline-block; background: #3B6D11; color: #ffffff; text-decoration: none;
                font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 8px;">
        Go to Login
      </a>
    </div>
  </div>
`;