import {
  checkRole
} from "./chunk-WAXIKHJ4.js";
import {
  handleError
} from "./chunk-ZOAOPETN.js";
import {
  prisma
} from "./chunk-KRHBA2SY.js";
import {
  schemaEvent
} from "./chunk-JYXM2VRB.js";

// src/http/events/createEventRoute.ts
async function createEventRoute(fastify) {
  fastify.post("/eventos", {
    onRequest: [fastify.authenticate, await checkRole("Admin")]
  }, async (request, reply) => {
    try {
      const {
        title,
        description,
        linkEvent,
        address,
        startDateTime,
        endDateTime,
        accessibilityLevel
      } = request.body;
      await schemaEvent.validateAsync({
        title,
        description,
        linkEvent,
        address,
        startDateTime,
        endDateTime,
        accessibilityLevel
      });
      const newEvent = await prisma.event.create({
        data: {
          title,
          description,
          linkEvent,
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          complement: address.complement,
          startDateTime,
          endDateTime,
          accessibilityLevel
        }
      });
      return reply.status(200).send(newEvent);
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  createEventRoute
};
