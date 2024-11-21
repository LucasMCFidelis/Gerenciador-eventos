import {
  prisma
} from "./chunk-KRHBA2SY.js";
import {
  schemaId
} from "./chunk-ILEFH35N.js";

// src/utils/db/getUserById.ts
async function getUserById(userId) {
  const { error } = schemaId.validate({ id: userId });
  if (error) {
    return {
      status: 400,
      message: error.message,
      error: "Erro de valida\xE7\xE3o"
    };
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId
      },
      select: {
        userId: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        role: true
      }
    });
    if (!user) {
      return {
        status: 404,
        message: "Usu\xE1rio n\xE3o encontrado",
        error: "Erro Not Found"
      };
    }
    return {
      status: 200,
      data: user,
      error: false
    };
  } catch (error2) {
    console.error("Erro ao buscar usu\xE1rio", error2);
    return {
      status: 500,
      message: "Erro interno ao buscar usu\xE1rio",
      error: "Erro no servidor"
    };
  }
}

export {
  getUserById
};
