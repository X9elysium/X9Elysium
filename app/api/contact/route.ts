import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      website,
      revenue,
      platform,
      service,
      message,
    } = body;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const htmlBody = `
      <h2>New Contact Form Submission</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Name</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${firstName} ${lastName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td></tr>
        ${phone ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Phone</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${phone}</td></tr>` : ""}
        ${company ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Company</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${company}</td></tr>` : ""}
        ${website ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Website</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${website}</td></tr>` : ""}
        ${revenue ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Annual Revenue</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${revenue}</td></tr>` : ""}
        ${platform ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Current Platform</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${platform}</td></tr>` : ""}
        ${service ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service Needed</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${service}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Message</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${message}</td></tr>
      </table>
    `;

    const mailOptions: Mail.Options = {
      from: process.env.MY_EMAIL,
      to: process.env.MY_EMAIL,
      replyTo: email,
      subject: `New inquiry from ${firstName} ${lastName}${company ? ` — ${company}` : ""}`,
      html: htmlBody,
    };

    await new Promise<string>((resolve, reject) => {
      transport.sendMail(mailOptions, (err) => {
        if (!err) {
          resolve("Email sent");
        } else {
          reject(err.message);
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
