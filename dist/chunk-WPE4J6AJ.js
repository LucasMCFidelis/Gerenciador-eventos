import {
  getUserById
} from "./chunk-HVJ57BPC.js";
import {
  handleError
} from "./chunk-ZOAOPETN.js";

// src/http/users/getUserRoute.ts
async function getUserRoute(fastify) {
  fastify.get("/usuarios/:id", async (request, reply) => {
    try {
      const userId = request.params.id;
      const userResponse = await getUserById(userId);
      if (!userResponse.data || userResponse.error) {
        return reply.status(userResponse.status).send({
          error: userResponse.error,
          message: userResponse.message
        });
      }
      return reply.status(200).send(userResponse.data);
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  getUserRoute
};
