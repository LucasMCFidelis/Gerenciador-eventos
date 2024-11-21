import {
  mapAccessibilityLevel
} from "./chunk-ATUXTFRN.js";
import {
  prisma
} from "./chunk-KRHBA2SY.js";
import {
  schemaId
} from "./chunk-ILEFH35N.js";

// src/utils/db/getEventById.ts
async function getEventById(eventId) {
  try {
    const { error } = schemaId.validate({ id: eventId });
    if (error) {
      return {
        status: 400,
        message: error.message,
        error: "Erro de valida\xE7\xE3o"
      };
    }
    const event = await prisma.event.findUnique({
      where: {
        eventId
      }
    });
    if (!event) {
      return {
        status: 404,
        message: "Evento n\xE3o encontrado",
        error: "Erro Not Found"
      };
    }
    return {
      status: 200,
      data: {
        eventId,
        title: event.title,
        description: event.description,
        linkEvent: event.linkEvent,
        address: {
          street: event.street,
          number: event.number,
          neighborhood: event.neighborhood,
          complement: event.complement
        },
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        accessibilityLevel: mapAccessibilityLevel(event.accessibilityLevel),
        createdAt: event.createdAt
      },
      error: false
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Erro ao consultar o evento",
      error: "Erro no servidor"
    };
  }
}

export {
  getEventById
};
