import {
  sendEmail
} from "./chunk-6CS7EY42.js";
import {
  prisma
} from "./chunk-KRHBA2SY.js";

// src/utils/email/sendRecoveryCode.ts
function generateRecoveryCode(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}
async function sendRecoveryCode(userEmail) {
  try {
    const recoveryCode = generateRecoveryCode(6);
    const expiresAt = /* @__PURE__ */ new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    const recoveryRecord = await prisma.recoveryCode.upsert({
      where: { userEmail },
      update: {
        userEmail,
        code: recoveryCode,
        expiresAt
      },
      create: {
        userEmail,
        code: recoveryCode,
        expiresAt
      }
    });
    console.log(recoveryRecord);
    const emailSubject = "C\xF3digo de Recupera\xE7\xE3o de Senha";
    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p style="font-size: 18px;">Ol\xE1,</p>
          <p style="font-size: 16px;">Recebemos uma solicita\xE7\xE3o para a recupera\xE7\xE3o da sua senha. Para continuar, por favor, utilize o c\xF3digo abaixo:</p>
          <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px; text-align: center; font-size: 20px; font-weight: bold; color: #2c3e50;">
              ${recoveryCode}
          </div>
          <p style="font-size: 16px; margin-top: 10px;">\u26A0\uFE0F Lembre-se: Este c\xF3digo \xE9 v\xE1lido por apenas <strong>1 hora</strong>. Ap\xF3s esse per\xEDodo, voc\xEA precisar\xE1 solicitar um novo c\xF3digo.</p>
          <p style="font-size: 16px;">Se voc\xEA n\xE3o solicitou a recupera\xE7\xE3o de senha, desconsidere este e-mail.</p>
          <p style="font-size: 16px;">Estamos aqui para ajudar! Se tiver alguma d\xFAvida, n\xE3o hesite em nos contatar.</p>
          <p style="font-size: 16px; font-weight: bold;">Atenciosamente,</p>
          <p style="font-size: 16px;">Equipe de Suporte do Sistema</p>
      </div>
    `;
    await sendEmail(userEmail, emailSubject, emailBody);
    return {
      status: 200,
      error: false
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      error: "Erro no servidor",
      message: "Erro ao enviar o c\xF3digo de recupera\xE7\xE3o"
    };
  }
}

export {
  sendRecoveryCode
};
