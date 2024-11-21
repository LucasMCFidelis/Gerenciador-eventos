import {
  prisma
} from "./chunk-KRHBA2SY.js";
import {
  schemaUserUpdate
} from "./chunk-ELLFQHHN.js";

// src/utils/db/getUserByEmail.ts
async function getUserByEmail(userEmail) {
  try {
    await schemaUserUpdate.validateAsync({ email: userEmail });
  } catch (error) {
    return {
      status: 400,
      message: error.message.toLowerCase(),
      error: "Erro de valida\xE7\xE3o",
      data: void 0
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      },
      select: {
        userId: true,
        email: true,
        password: true,
        role: {
          select: {
            roleId: true,
            roleName: true,
            roleDescription: true
          }
        }
      }
    });
    if (!user) {
      return {
        status: 404,
        message: "Nenhum usu\xE1rio encontrado com este email",
        error: "Erro Not Found",
        data: void 0
      };
    }
    return {
      status: 200,
      data: user,
      message: "Usu\xE1rio encontrado com sucesso",
      error: false
    };
  } catch (error) {
    console.error("Erro ao buscar usu\xE1rio", error);
    return {
      status: 500,
      message: "Erro interno ao buscar usu\xE1rio",
      error: "Erro no servidor",
      data: void 0
    };
  }
}

export {
  getUserByEmail
};
