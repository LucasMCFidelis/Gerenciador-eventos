import {
  hashPassword
} from "./chunk-LPPX337Y.js";
import {
  prisma
} from "./chunk-KRHBA2SY.js";

// src/utils/db/updateUserPassword.ts
async function updateUserPassword(userId, newPassword) {
  try {
    const newPasswordHash = await hashPassword(newPassword);
    await prisma.user.update({
      where: {
        userId
      },
      data: {
        password: newPasswordHash
      }
    });
    return {
      status: 200,
      message: "Senha atualizada com sucesso",
      error: false
    };
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      return {
        status: 404,
        message: "Usu\xE1rio n\xE3o encontrado para atualiza\xE7\xE3o",
        error: "Erro Not Found"
      };
    }
    return {
      status: 500,
      message: "Erro ao atualizar senha",
      error: "Erro no servidor"
    };
  }
}

export {
  updateUserPassword
};
