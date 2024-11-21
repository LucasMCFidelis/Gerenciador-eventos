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
import {
  schemaEventUpdate
} from "./chunk-D2ZSRSED.js";

// src/http/events/updateEventRoute.ts
async function UpdateEventRoute(fastify) {
  fastify.put("/eventos/:id", {
    onRequest: [fastify.authenticate, await checkRole("Admin")]
  }, async (request, reply) => {
    try {
      const { title, description, linkEvent, address, startDateTime, endDateTime, accessibilityLevel } = request.body;
      const eventId = request.params.id;
      const user = request.user;
      if (!user.userId) {
        const errorValue = "Erro de valida\xE7\xE3o";
        return reply.status(400).send({
          error: errorValue,
          message: "userId \xE9 obrigat\xF3rio"
        });
      }
      await schemaEventUpdate.validateAsync({
        title,
        description,
        linkEvent,
        address,
        startDateTime,
        endDateTime,
        accessibilityLevel
      });
      const checkResponse = await checkExistingEvent(eventId);
      if (!checkResponse.eventExisting) {
        return reply.status(checkResponse.status).send({
          error: checkResponse.error,
          message: checkResponse.message
        });
      }
      const updatedEvent = await prisma.event.update({
        data: {
          ...title && { title },
          ...description && { description },
          ...linkEvent && { linkEvent },
          ...address?.street && { street: address.street },
          ...address?.number && { number: address.number },
          ...address?.neighborhood && { neighborhood: address.neighborhood },
          ...address?.complement && { complement: address.complement },
          ...startDateTime && { startDateTime },
          ...endDateTime && { endDateTime },
          ...accessibilityLevel && { accessibilityLevel }
        },
        where: {
          eventId
        }
      });
      return reply.status(200).send(updatedEvent);
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  UpdateEventRoute
};
