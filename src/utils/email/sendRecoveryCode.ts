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
    // const emailSubject = "Código de Recuperação de Senha";
    // const emailBody = `
    //   <p>Olá,</p>
    //   <p>Você solicitou a recuperação de senha. Use o código abaixo para prosseguir com a alteração de senha:</p>
    //   <p><strong>${recoveryCode}</strong></p>
    //   <p>Este código expirará em 1 hora.</p>
    //   <p>Atenciosamente,</p>
    //   <p>Equipe do Sistema</p>
    // `;

    // await sendEmail(userEmail, emailSubject, emailBody);

    return { 
        status: 200,
        error: false,
    };

  } catch (error) {
    console.error(error);
    return { 
        status: 500,
        error: true, 
        message: "Erro ao enviar o código de recuperação" 
    };
  }
}
