import {
  prisma
} from "./chunk-KRHBA2SY.js";

// src/utils/validators/checkExistingUser.ts
async function checkExistingUser(userEmail) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { email: true }
    });
    if (existingUser) {
      return {
        status: 409,
        existingUser: true,
        message: "Este e-mail j\xE1 est\xE1 cadastrado.",
        error: "Erro de Conflito"
      };
    }
    return {
      status: 200,
      existingUser: false,
      message: "E-mail dispon\xEDvel para cadastro.",
      error: false
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      existingUser: false,
      message: "Erro ao verificar exist\xEAncia do usu\xE1rio.",
      error: "Erro no servidor"
    };
  }
}

export {
  checkExistingUser
};
