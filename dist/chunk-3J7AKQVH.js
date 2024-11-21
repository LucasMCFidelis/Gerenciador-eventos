import {
  handleError
} from "./chunk-ZOAOPETN.js";
import {
  prisma
} from "./chunk-KRHBA2SY.js";

// src/http/events/listEventsRoute.ts
async function listEventRoute(fastify) {
  fastify.get("/eventos", async (request, reply) => {
    try {
      const events = await prisma.event.findMany({
        orderBy: {
          title: "asc"
        }
      });
      if (events.length > 0) {
        const formattedEvents = events.map((event) => ({
          eventId: event.eventId,
          title: event.title,
          description: event.description || null,
          linkEvent: event.linkEvent || null,
          address: {
            street: event.street,
            number: event.number,
            neighborhood: event.neighborhood,
            complement: event.complement || null
          },
          accessibilityLevel: event.accessibilityLevel,
          startDateTime: event.startDateTime.toISOString(),
          endDateTime: event.endDateTime ? event.endDateTime.toISOString() : null,
          createdAt: event.createdAt.toISOString()
        }));
        return reply.status(200).send(formattedEvents);
      } else {
        const errorValue = "Erro Not Found";
        return reply.status(404).send({
          error: errorValue,
          message: "Nenhum evento encontrado"
        });
      }
    } catch (error) {
      return handleError(error, reply);
    }
  });
}

export {
  listEventRoute
};
