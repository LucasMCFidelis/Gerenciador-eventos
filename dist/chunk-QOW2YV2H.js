// src/utils/security/authorizeUserById.ts
function authorizeUserById(targetUserId) {
  return (request, reply) => {
    const { user } = request;
    if (!user || targetUserId !== user.userId) {
      const errorValue = "Erro de autoriza\xE7\xE3o";
      return reply.status(403).send({
        error: errorValue,
        message: "Acesso negado. O ID do usu\xE1rio logado n\xE3o corresponde ao ID solicitado para a opera\xE7\xE3o."
      });
    }
  };
}

export {
  authorizeUserById
};
