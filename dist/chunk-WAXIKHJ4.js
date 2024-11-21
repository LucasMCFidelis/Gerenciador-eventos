// src/utils/security/checkRole.ts
async function checkRole(requiredRole) {
  return async (request, reply) => {
    const userRole = request.user.roleName;
    if (userRole !== requiredRole) {
      const errorValue = "Erro de autoriza\xE7\xE3o";
      reply.status(403).send({
        error: errorValue,
        message: `Permiss\xE3o insuficiente. Requerido: ${requiredRole}, atual: ${userRole}`
      });
    }
  };
}

export {
  checkRole
};
