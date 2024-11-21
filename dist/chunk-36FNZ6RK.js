import {
  getEventById
} from "./chunk-BMA7U7YX.js";
import {
  handleError
} from "./chunk-ZOAOPETN.js";

// src/http/events/getEventRoute.ts
async function getEventRoute(fastify) {
  fastify.get("/eventos/:id", async (request, reply) => {
    try {
      const eventId = request.params.id;
      const eventResponse = await getEventById(eventId);
      if (!eventResponse.data || eventResponse.error) {
        return reply.status(eventResponse.status).send({
          error: eventResponse.error,
          message: eventResponse.message
        });
      }
      return reply.status(200).send(eventResponse.data);
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  getEventRoute
};
