import { NextResponse } from "next/server";

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

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY,
        subject: `New inquiry from ${firstName} ${lastName}${company ? ` — ${company}` : ""}`,
        from_name: `${firstName} ${lastName}`,
        replyto: email,
        name: `${firstName} ${lastName}`,
        email,
        phone: phone || "Not provided",
        company: company || "Not provided",
        website: website || "Not provided",
        annual_revenue: revenue || "Not provided",
        current_platform: platform || "Not provided",
        service_needed: service || "Not provided",
        message,
      }),
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
