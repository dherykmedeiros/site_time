import { Resend } from "resend";

let resend: Resend | null = null;

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

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
  const client = getResend();

  const { data, error } = await client.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    html,
  });

  if (error) {
    throw new Error(`Falha ao enviar e-mail: ${error.message}`);
  }

  return {
    success: true,
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
    subject: `Convite para ${params.teamName}`,
    html: `
      <h2>Olá!</h2>
      <p>Você foi convidado(a) para fazer parte do time <strong>${params.teamName}</strong> como <strong>${params.playerName}</strong>.</p>
      <p>Clique no link abaixo para criar sua conta:</p>
      <p><a href="${params.inviteUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px;">Aceitar Convite</a></p>
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
    subject: `Amistoso aprovado - ${params.teamName}`,
    html: `
      <h2>Amistoso Aprovado!</h2>
      <p>Sua solicitação de amistoso para o time <strong>${params.teamName}</strong> foi aprovada.</p>
      <p><strong>Data:</strong> ${params.matchDate}</p>
      <p><strong>Local:</strong> ${params.venue}</p>
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
    subject: `Solicitação de amistoso - ${params.teamName}`,
    html: `
      <h2>Solicitação de Amistoso</h2>
      <p>Infelizmente, sua solicitação de amistoso para o time <strong>${params.teamName}</strong> não foi aprovada.</p>
      <p><strong>Motivo:</strong> ${params.reason}</p>
    `,
  });
}
