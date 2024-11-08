import { GetResponse } from "../../interfaces/getResponseInterface.js";
import { prisma } from "../../utils/db/prisma.js";

// Função para gerar código aleatório
function generateRecoveryCode(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

// Função para enviar o código de recuperação por e-mail
export async function sendRecoveryCode(
  userEmail: string
): Promise<GetResponse> {
  try {
    // Gerar um código aleatório de 6 caracteres
    const recoveryCode = generateRecoveryCode(6);

    // Definir tempo de expiração do código (por exemplo, 1 hora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // Expira em 1 hora

    // Armazenar o código de recuperação no banco de dados
    const recoveryRecord = await prisma.recoveryCode.upsert({
      where: { userEmail },
      update: {
        userEmail: userEmail,
        code: recoveryCode,
        expiresAt: expiresAt,
      },
      create: {
        userEmail: userEmail,
        code: recoveryCode,
        expiresAt: expiresAt,
      },
    });

    console.log(recoveryRecord);

    return {
      status: 200,
      error: false,
      message: "Código de recuperação enviado para o seu e-mail",
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      error: true,
      message: "Erro ao enviar o código de recuperação",
    };
  }
}
