import {
  sendRecoveryCode
} from "./chunk-TPCEKKVW.js";
import {
  getUserByEmail
} from "./chunk-6GABII7F.js";
import {
  handleError
} from "./chunk-ZOAOPETN.js";

// src/http/users/sendRecoveryCodeRoute.ts
async function sendRecoveryCodeRoute(fastify) {
  fastify.post("/usuarios/recuperacao/enviar-codigo", async (request, reply) => {
    const { email } = request.body;
    try {
      const userResponse = await getUserByEmail(email);
      const user = userResponse.data;
      if (!user || userResponse.error) {
        return reply.status(userResponse.status).send({
          error: userResponse.error,
          message: userResponse.message
        });
      }
      const sendCode = await sendRecoveryCode(email);
      if (sendCode.error) {
        return reply.status(sendCode.status).send({
          error: sendCode.error,
          message: sendCode.message
        });
      }
      return reply.status(200).send({
        message: "C\xF3digo de recupera\xE7\xE3o enviado para o seu e-mail"
      });
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  sendRecoveryCodeRoute
};
