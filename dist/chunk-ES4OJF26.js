import {
  checkExistingEvent
} from "./chunk-JQWT63BZ.js";
import {
  checkRole
} from "./chunk-WAXIKHJ4.js";
import {
  handleError
} from "./chunk-ZOAOPETN.js";
import {
  prisma
} from "./chunk-KRHBA2SY.js";

// src/http/events/deleteEventRoute.ts
async function deleteEventRoute(fastify) {
  fastify.delete("/eventos/:id", {
    onRequest: [fastify.authenticate, await checkRole("Admin")]
  }, async (request, reply) => {
    try {
      const eventId = request.params.id;
      const checkResponse = await checkExistingEvent(eventId);
      if (!checkResponse.eventExisting) {
        return reply.status(checkResponse.status).send({
          error: checkResponse.error,
          message: checkResponse.message
        });
      }
      await prisma.event.delete({
        where: {
          eventId
        }
      });
      return reply.status(204).send();
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  deleteEventRoute
};
