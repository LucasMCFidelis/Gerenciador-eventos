import {
  prisma
} from "./chunk-KRHBA2SY.js";

// src/utils/validators/validateRecoveryCode.ts
async function validateRecoveryCode({ userEmail, recoveryCode }) {
  try {
    const recoveryRecord = await prisma.recoveryCode.findFirst({
      where: {
        userEmail,
        code: recoveryCode
      }
    });
    if (!recoveryRecord) {
      return {
        status: 400,
        error: "Erro de valida\xE7\xE3o",
        message: "C\xF3digo de recupera\xE7\xE3o inv\xE1lido"
      };
    }
    const currentTime = /* @__PURE__ */ new Date();
    if (currentTime > new Date(recoveryRecord.expiresAt)) {
      return {
        status: 400,
        error: "Erro de valida\xE7\xE3o",
        message: "C\xF3digo de recupera\xE7\xE3o expirado"
      };
    }
    return {
      status: 200,
      error: false,
      message: "C\xF3digo v\xE1lido"
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      error: "Erro no servidor",
      message: "Erro ao validar o c\xF3digo de recupera\xE7\xE3o"
    };
  }
}

export {
  validateRecoveryCode
};
