import {
  validateRecoveryCode
} from "./chunk-CQ726DUO.js";
import {
  updateUserPassword
} from "./chunk-7EOILMO7.js";
import {
  getUserByEmail
} from "./chunk-6GABII7F.js";
import {
  handleError
} from "./chunk-ZOAOPETN.js";
import {
  schemaUserPassword
} from "./chunk-LXJDJKI7.js";

// src/http/users/updateUserPasswordRoute.ts
async function updateUserPasswordRoute(fastify) {
  fastify.patch("/usuarios/recuperacao/atualizar-senha", async (request, reply) => {
    try {
      const { email, newPassword, recoveryCode } = request.body;
      const userResponse = await getUserByEmail(email);
      const user = userResponse.data;
      if (!user || userResponse.error) {
        return reply.status(userResponse.status).send({
          error: userResponse.error,
          message: userResponse.message
        });
      }
      const validateCode = await validateRecoveryCode({
        userEmail: email,
        recoveryCode
      });
      if (validateCode.error) {
        return reply.status(validateCode.status).send({
          error: validateCode.error,
          message: validateCode.message
        });
      }
      await schemaUserPassword.validateAsync({ password: newPassword });
      const updateResponse = await updateUserPassword(user.userId, newPassword);
      if (updateResponse.error) {
        return reply.status(updateResponse.status).send({
          error: updateResponse.error,
          message: updateResponse.message
        });
      }
      return reply.status(200).send({
        message: "Senha atualizada com sucesso"
      });
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  updateUserPasswordRoute
};
