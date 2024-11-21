import {
  checkExistingUser
} from "./chunk-LJXII5C6.js";
import {
  authorizeUserById
} from "./chunk-QOW2YV2H.js";
import {
  getUserById
} from "./chunk-HVJ57BPC.js";
import {
  handleError
} from "./chunk-ZOAOPETN.js";
import {
  prisma
} from "./chunk-KRHBA2SY.js";
import {
  schemaUserUpdate
} from "./chunk-ELLFQHHN.js";

// src/http/users/updateUserRoute.ts
async function updateUserRoute(fastify) {
  fastify.put("/usuarios/:id", {
    onRequest: [
      fastify.authenticate,
      async (request, reply) => await authorizeUserById(request.params.id)(request, reply)
    ]
  }, async (request, reply) => {
    try {
      const userId = request.params.id;
      const userResponse = await getUserById(userId);
      if (!userResponse.data || userResponse.error) {
        return reply.status(userResponse.status).send({
          error: userResponse.error,
          message: userResponse.message
        });
      }
      const user = userResponse.data;
      const userData = await schemaUserUpdate.validateAsync(request.body);
      const { firstName, lastName, email, phoneNumber } = userData;
      if (email !== user.email) {
        const emailCheckResponse = await checkExistingUser(email);
        if (emailCheckResponse.existingUser || emailCheckResponse.error) {
          return reply.status(emailCheckResponse.status).send({
            error: emailCheckResponse.error,
            message: emailCheckResponse.message
          });
        }
      }
      await prisma.user.update({
        where: {
          userId: user.userId
        },
        data: {
          ...firstName && { firstName },
          ...lastName && { lastName },
          ...email && { email },
          ...phoneNumber && { phoneNumber }
        }
      });
      return reply.status(200).send({
        message: "Usu\xE1rio atualizado com sucesso"
      });
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  updateUserRoute
};
