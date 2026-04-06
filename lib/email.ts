import { Resend } from "resend";

let resend: Resend | null = null;

/** Escape user-controlled strings before interpolating into HTML emails. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

type EmailProvider = "resend" | "brevo";

function getEmailProvider(): EmailProvider {
  const configured = (process.env.EMAIL_PROVIDER || "").toLowerCase();
  if (configured === "brevo") return "brevo";
  if (configured === "resend") return "resend";
  // Auto mode: prefer Brevo when key exists to support no-domain setups.
  if (process.env.BREVO_API_KEY) return "brevo";
  return "resend";
}

function getResend(): Resend {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_xxxxxxxxxxxx") {
    throw new Error("RESEND_API_KEY nao configurada");
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

function getBrevoConfig() {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Site Time";

  if (!apiKey) {
    throw new Error("BREVO_API_KEY nao configurada");
  }

  if (!senderEmail) {
    throw new Error("BREVO_SENDER_EMAIL nao configurada");
  }

  return { apiKey, senderEmail, senderName };
}

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
  const provider = getEmailProvider();

  if (provider === "brevo") {
    const { apiKey, senderEmail, senderName } = getBrevoConfig();
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: {
          email: senderEmail,
          name: senderName,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`Falha ao enviar e-mail (Brevo): ${response.status} ${details}`);
    }

    const data = (await response.json()) as { messageId?: string };
    return {
      success: true,
      provider,
      messageId: data.messageId,
    };
  }

  const client = getResend();

  const { data, error } = await client.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Falha ao enviar e-mail (Resend): ${error.message}`);
  }

  return {
    success: true,
    provider,
    messageId: data?.id,
  };
}

export async function sendInviteEmail(params: {
  to: string;
  playerName: string;
  teamName: string;
  inviteUrl: string;
}) {
  return sendEmail({
    to: params.to,
    subject: `Convite para ${escapeHtml(params.teamName)}`,
    html: `
      <h2>Olá!</h2>
      <p>Você foi convidado(a) para fazer parte do time <strong>${escapeHtml(params.teamName)}</strong> como <strong>${escapeHtml(params.playerName)}</strong>.</p>
      <p>Clique no link abaixo para criar sua conta:</p>
      <p><a href="${escapeHtml(params.inviteUrl)}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Aceitar Convite</a></p>
      <p><small>Este convite expira em 7 dias.</small></p>
    `,
  });
}

export async function sendFriendlyApprovalEmail(params: {
  to: string;
  requesterTeamName: string;
  teamName: string;
  matchDate: string;
  venue: string;
}) {
  return sendEmail({
    to: params.to,
    subject: `Amistoso aprovado - ${escapeHtml(params.teamName)}`,
    html: `
      <h2>Amistoso Aprovado!</h2>
      <p>Sua solicitação de amistoso para o time <strong>${escapeHtml(params.teamName)}</strong> foi aprovada.</p>
      <p><strong>Data:</strong> ${escapeHtml(params.matchDate)}</p>
      <p><strong>Local:</strong> ${escapeHtml(params.venue)}</p>
      <p>Boa partida!</p>
    `,
  });
}

export async function sendFriendlyRejectionEmail(params: {
  to: string;
  requesterTeamName: string;
  teamName: string;
  reason: string;
}) {
  return sendEmail({
    to: params.to,
    subject: `Solicitação de amistoso - ${escapeHtml(params.teamName)}`,
    html: `
      <h2>Solicitação de Amistoso</h2>
      <p>Infelizmente, sua solicitação de amistoso para o time <strong>${escapeHtml(params.teamName)}</strong> não foi aprovada.</p>
      <p><strong>Motivo:</strong> ${escapeHtml(params.reason)}</p>
    `,
  });
}
