import type { NormalizedLead } from "./index";

export function renderLeadEmail(lead: NormalizedLead): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
           <td style="padding:10px 16px;color:#737373;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;border-bottom:1px solid #f0f0f0;width:38%">${escapeHtml(label)}</td>
           <td style="padding:10px 16px;color:#171717;font-size:14px;border-bottom:1px solid #f0f0f0">${escapeHtml(value)}</td>
         </tr>`
      : "";

  const fullName = `${lead.firstName} ${lead.lastName}`.trim();
  const subjectLine = lead.company ? `${fullName} · ${lead.company}` : fullName;

  return `<!doctype html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:32px 24px;color:#fff">
    <div style="border-left:3px solid #10b981;padding:4px 0 4px 16px;margin-bottom:28px">
      <p style="margin:0;color:#10b981;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em">New lead · x9elysium.com</p>
      <h1 style="margin:6px 0 0;font-size:22px;font-weight:300;letter-spacing:-0.01em">${escapeHtml(subjectLine)}</h1>
    </div>

    <table style="width:100%;border-collapse:collapse;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,0.03)">
      ${row("Email", lead.email)}
      ${row("Phone", lead.phone)}
      ${row("Website", lead.website)}
      ${row("Annual revenue", lead.revenue)}
      ${row("Current platform", lead.platform)}
      ${row("Service needed", lead.service)}
    </table>

    <div style="background:#fff;color:#171717;border-radius:10px;padding:20px 22px;margin-top:14px;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(lead.message)}</div>

    <div style="display:flex;gap:8px;margin-top:24px">
      <a href="mailto:${escapeHtml(lead.email)}" style="display:inline-block;background:#10b981;color:#000;text-decoration:none;font-size:13px;font-weight:500;padding:10px 16px;border-radius:8px">Reply to ${escapeHtml(lead.firstName)}</a>
    </div>

    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #262626;color:#737373;font-size:11px;line-height:1.7">
      Received ${escapeHtml(lead.receivedAt)}<br>
      IP ${escapeHtml(lead.ip)}<br>
      ${lead.referer ? `From: ${escapeHtml(lead.referer)}` : ""}
    </div>
  </div>
</body>
</html>`;
}

export function renderLeadText(lead: NormalizedLead): string {
  return [
    "New lead — x9elysium.com",
    "",
    `Name:     ${lead.firstName} ${lead.lastName}`,
    `Email:    ${lead.email}`,
    `Phone:    ${lead.phone || "—"}`,
    `Company:  ${lead.company || "—"}`,
    `Website:  ${lead.website || "—"}`,
    `Revenue:  ${lead.revenue || "—"}`,
    `Platform: ${lead.platform || "—"}`,
    `Service:  ${lead.service || "—"}`,
    "",
    "Message:",
    lead.message,
    "",
    "---",
    `Received ${lead.receivedAt}`,
    `IP ${lead.ip}`,
    `Referer ${lead.referer || "—"}`,
  ].join("\n");
}

export function renderAutoReply(lead: NormalizedLead): string {
  return `<!doctype html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;color:#fff">
    <p style="color:#10b981;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 16px">X9Elysium</p>
    <h1 style="font-size:26px;font-weight:300;margin:0 0 24px;color:#fff;letter-spacing:-0.01em">Hi ${escapeHtml(lead.firstName)} —</h1>
    <p style="font-size:15px;line-height:1.7;color:#a3a3a3;margin:0 0 16px">Thanks for reaching out. Your message landed in my inbox directly — not a queue, not a CRM, not an SDR.</p>
    <p style="font-size:15px;line-height:1.7;color:#a3a3a3;margin:0 0 16px">I'll review what you sent and reply within 24 hours (usually sooner) with thoughts and a few clarifying questions before we book a discovery call.</p>
    <p style="font-size:15px;line-height:1.7;color:#a3a3a3;margin:0 0 32px">If anything urgent comes up before then, just reply to this email — it goes straight to me.</p>
    <p style="font-size:15px;color:#fff;margin:0">— Darshan</p>
    <p style="font-size:13px;color:#737373;margin:4px 0 0">Founder · X9Elysium</p>
    <div style="margin-top:48px;padding-top:24px;border-top:1px solid #262626;color:#525252;font-size:11px;line-height:1.7">
      X9Elysium · Founder-led Shopify Plus consulting<br>
      <a href="https://x9elysium.com" style="color:#10b981;text-decoration:none">x9elysium.com</a> · 28 Ann St, Mississauga ON
    </div>
  </div>
</body>
</html>`;
}

export function renderAutoReplyText(lead: NormalizedLead): string {
  return [
    `Hi ${lead.firstName} —`,
    "",
    "Thanks for reaching out. Your message landed in my inbox directly — not a queue, not a CRM, not an SDR.",
    "",
    "I'll review what you sent and reply within 24 hours (usually sooner) with thoughts and a few clarifying questions before we book a discovery call.",
    "",
    "If anything urgent comes up before then, just reply to this email — it goes straight to me.",
    "",
    "— Darshan",
    "Founder · X9Elysium",
    "x9elysium.com",
  ].join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
