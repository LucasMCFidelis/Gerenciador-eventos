// src/utils/handlers/handleError.ts
function handleError(error, reply) {
  if (error instanceof Error) {
    console.error(error.message);
    return reply.status(400).send({
      error: "Erro de valida\xE7\xE3o",
      message: error.message.toLowerCase()
    });
  } else {
    console.error("Erro desconhecido", error);
    return reply.status(500).send({
      error: "Erro no servidor",
      message: "Erro interno ao realizar opera\xE7\xE3o"
    });
  }
}

export {
  handleError
};
