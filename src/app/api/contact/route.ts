import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.MAISON_EMAIL_KEY);

export async function POST(req: Request) {
  if (!process.env.MAISON_EMAIL_KEY) {
    console.error('MAISON_EMAIL_KEY is not set');
    return NextResponse.json({ error: 'Email service not configured' }, { status: 500 });
  }

  try {
    const body = await req.json();

    const {
      firstName, lastName, partnerName,
      email, phone,
      eventDate, eventLocation, guestCount,
      budget, collection, experience,
      contactMethod, message,
    } = body;

    const { error } = await resend.emails.send({
      from:    'Maison RSVP <concierge@maisonrsvp.ca>',
      to:      'concierge@maisonrsvp.ca',
      replyTo: email,
      subject: `New commission enquiry — ${firstName} ${lastName}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="border-bottom: 1px solid #c9a882; padding-bottom: 24px; margin-bottom: 24px;">
            <h1 style="font-size: 22px; font-weight: 400; margin: 0;">New commission enquiry</h1>
            <p style="color: #888; font-size: 13px; margin: 6px 0 0;">Maison RSVP · concierge@maisonrsvp.ca</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 15px; line-height: 1.8;">
            <tr><td style="color: #888; width: 180px; padding: 4px 0;">Name</td><td><strong>${firstName} ${lastName}</strong></td></tr>
            ${partnerName ? `<tr><td style="color: #888; padding: 4px 0;">Partner</td><td>${partnerName}</td></tr>` : ''}
            <tr><td style="color: #888; padding: 4px 0;">Email</td><td><a href="mailto:${email}" style="color: #c9a882;">${email}</a></td></tr>
            ${phone ? `<tr><td style="color: #888; padding: 4px 0;">Phone</td><td>${phone}</td></tr>` : ''}
            <tr><td colspan="2" style="padding: 16px 0 4px; border-top: 1px solid #eee;"></td></tr>
            ${eventDate ? `<tr><td style="color: #888; padding: 4px 0;">Event date</td><td>${eventDate}</td></tr>` : ''}
            ${eventLocation ? `<tr><td style="color: #888; padding: 4px 0;">Location</td><td>${eventLocation}</td></tr>` : ''}
            ${guestCount ? `<tr><td style="color: #888; padding: 4px 0;">Guest count</td><td>${guestCount}</td></tr>` : ''}
            ${budget ? `<tr><td style="color: #888; padding: 4px 0;">Budget</td><td>${budget}</td></tr>` : ''}
            ${collection ? `<tr><td style="color: #888; padding: 4px 0;">Collection</td><td>${collection}</td></tr>` : ''}
            ${experience ? `<tr><td style="color: #888; padding: 4px 0;">Heard about us</td><td>${experience}</td></tr>` : ''}
            <tr><td style="color: #888; padding: 4px 0;">Preferred contact</td><td>${contactMethod}</td></tr>
            ${message ? `
            <tr><td colspan="2" style="padding: 16px 0 4px; border-top: 1px solid #eee;"></td></tr>
            <tr><td colspan="2" style="color: #888; padding: 4px 0; font-size: 13px;">Message</td></tr>
            <tr><td colspan="2" style="padding: 8px 0; font-style: italic;">${message.replace(/\n/g, '<br>')}</td></tr>
            ` : ''}
          </table>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee; font-size: 12px; color: #aaa;">
            Submitted via maisonrsvp.ca/contact
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Email failed to send' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });

  } catch (err) {
    console.error('Contact submission error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
