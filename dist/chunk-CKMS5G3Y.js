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

// src/http/users/deleteUserRoute.ts
async function deleteUserRoute(fastify) {
  fastify.delete("/usuarios/:id", {
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
      await prisma.user.delete({
        where: {
          userId
        }
      });
      return reply.status(204).send({ message: "Usu\xE1rio exclu\xEDdo com sucesso" });
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  deleteUserRoute
};
