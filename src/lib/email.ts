import nodemailer from 'nodemailer';
import config from './config';

/**
 * ============================================================
 * EMAIL NOTIFICATION UTILITY (Nodemailer)
 * ============================================================
 * All email sending goes through this module.
 * Configure SMTP via environment variables in .env.local
 * ============================================================
 */

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// ── Generic email sender ──────────────────────────────────────
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  // If email credentials are not configured, log a warning and skip
  if (!config.email.user || !config.email.pass) {
    console.warn('[Email] SMTP credentials not configured — skipping email send.');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: config.email.from,
      to,
      subject,
      html,
    });
    console.log('[Email] Sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Email] Error:', error.message);
    return { success: false, error: error.message };
  }
}

// ── Contact form notification to admin ─────────────────────────
export async function sendContactFormMessage({
  name,
  email,
  phone,
  course,
  message,
}: {
  name: string;
  email?: string;
  phone?: string;
  course?: string;
  message: string;
}) {
  const adminEmail = config.email.user || 'admin@balajicomputerclasses.in';

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid rgba(99,102,241,0.3);">
      <div style="background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%); padding: 28px 32px;">
        <h1 style="margin: 0; font-size: 22px; color: white;">📩 New Contact Form Message</h1>
        <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Balaji Computer Classes Website</p>
      </div>
      <div style="padding: 28px 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px; width: 100px;">Name</td>
            <td style="padding: 10px 0; color: #f8fafc; font-weight: 600;">${name}</td>
          </tr>
          ${email ? `<tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; color: #f8fafc;"><a href="mailto:${email}" style="color: #818cf8;">${email}</a></td>
          </tr>` : ''}
          ${phone ? `<tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Phone</td>
            <td style="padding: 10px 0; color: #f8fafc;"><a href="tel:${phone}" style="color: #818cf8;">${phone}</a></td>
          </tr>` : ''}
          ${course ? `<tr>
            <td style="padding: 10px 0; color: #94a3b8; font-size: 13px;">Course</td>
            <td style="padding: 10px 0; color: #f8fafc;">${course}</td>
          </tr>` : ''}
        </table>
        <div style="margin-top: 20px; padding: 20px; background: rgba(99,102,241,0.1); border-radius: 12px; border: 1px solid rgba(99,102,241,0.2);">
          <div style="color: #94a3b8; font-size: 12px; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Message</div>
          <p style="margin: 0; color: #f8fafc; line-height: 1.7; font-size: 14px;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
      <div style="padding: 16px 32px; background: rgba(99,102,241,0.05); border-top: 1px solid rgba(99,102,241,0.1); text-align: center;">
        <p style="margin: 0; color: #64748b; font-size: 12px;">Sent from balajicomputerclasses.in contact form</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `📩 New Contact: ${name} — ${course || 'General Inquiry'}`,
    html,
  });
}

// ── Enrollment confirmation to student ──────────────────────────
export async function sendEnrollmentConfirmation({
  studentName,
  studentEmail,
  courseName,
}: {
  studentName: string;
  studentEmail: string;
  courseName: string;
}) {
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0e1a; color: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid rgba(99,102,241,0.3);">
      <div style="background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%); padding: 32px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; color: white;">🎉 Enrollment Request Received!</h1>
      </div>
      <div style="padding: 32px;">
        <p style="color: #f8fafc; font-size: 16px; line-height: 1.7;">Hi <strong>${studentName}</strong>,</p>
        <p style="color: #94a3b8; font-size: 15px; line-height: 1.7;">
          Your enrollment request for <strong style="color: #818cf8;">${courseName}</strong> has been received! 
          Our team will review it and get back to you within 24 hours.
        </p>
        <div style="margin: 24px 0; padding: 20px; background: rgba(16,185,129,0.1); border-radius: 12px; border: 1px solid rgba(16,185,129,0.2); text-align: center;">
          <p style="margin: 0; color: #34d399; font-size: 14px; font-weight: 600;">✅ Status: Pending Review</p>
        </div>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.7;">
          In the meantime, feel free to reach out via WhatsApp or phone if you have any questions.
        </p>
        <p style="color: #f8fafc; margin-top: 24px;">Best regards,<br><strong style="color: #818cf8;">Balaji Computer Classes</strong></p>
      </div>
      <div style="padding: 16px 32px; background: rgba(99,102,241,0.05); border-top: 1px solid rgba(99,102,241,0.1); text-align: center;">
        <p style="margin: 0; color: #64748b; font-size: 12px;">📞 +91 98765 43210 | 📧 info@balajicomputerclasses.in</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: studentEmail,
    subject: `🎉 Enrollment Request Received — ${courseName} | Balaji Computer Classes`,
    html,
  });
}
