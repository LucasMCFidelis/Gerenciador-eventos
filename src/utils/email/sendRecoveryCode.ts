import { GetResponse } from "../../interfaces/getResponseInterface.js";
import { prisma } from "../../utils/db/prisma.js"; 
import { sendEmail } from "../../utils/email/sendEmail.js"; 

// Função para gerar código aleatório
function generateRecoveryCode(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Função para enviar o código de recuperação por e-mail
export async function sendRecoveryCode(userEmail: string): Promise<GetResponse> {
  try {
    // Gerar um código aleatório de 6 caracteres
    const recoveryCode = generateRecoveryCode(6);

    // Definir tempo de expiração do código (por exemplo, 1 hora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expira em 1 hora

    // Armazenar o código de recuperação no banco de dados
    const recoveryRecord = await prisma.recoveryCode.upsert({
      where: {userEmail},
      update: {
        userEmail: userEmail,
        code: recoveryCode,
        expiresAt: expiresAt,
        
      },
      create: {
        userEmail: userEmail,
        code: recoveryCode,
        expiresAt: expiresAt,
      }
    });

    console.log(recoveryRecord);

    // Enviar o código de recuperação por e-mail (usando uma função de envio de e-mail)
    const emailSubject = "Código de Recuperação de Senha";
    const emailBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p style="font-size: 18px;">Olá,</p>
          <p style="font-size: 16px;">Recebemos uma solicitação para a recuperação da sua senha. Para continuar, por favor, utilize o código abaixo:</p>
          <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 15px; border-radius: 5px; text-align: center; font-size: 20px; font-weight: bold; color: #2c3e50;">
              ${recoveryCode}
          </div>
          <p style="font-size: 16px; margin-top: 10px;">⚠️ Lembre-se: Este código é válido por apenas <strong>1 hora</strong>. Após esse período, você precisará solicitar um novo código.</p>
          <p style="font-size: 16px;">Se você não solicitou a recuperação de senha, desconsidere este e-mail.</p>
          <p style="font-size: 16px;">Estamos aqui para ajudar! Se tiver alguma dúvida, não hesite em nos contatar.</p>
          <p style="font-size: 16px; font-weight: bold;">Atenciosamente,</p>
          <p style="font-size: 16px;">Equipe de Suporte do Sistema</p>
      </div>
    `;

    await sendEmail(userEmail, emailSubject, emailBody);

    return { 
        status: 200,
        error: false,
    };

  } catch (error) {
    console.error(error);
    return { 
        status: 500,
        error: "Erro no servidor", 
        message: "Erro ao enviar o código de recuperação" 
    };
  }
}
