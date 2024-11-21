import {
  prisma
} from "./chunk-KRHBA2SY.js";

// src/utils/validators/checkExistingEvent.ts
async function checkExistingEvent(eventId) {
  try {
    const event = await prisma.event.findUnique({
      select: {
        eventId: true
      },
      where: {
        eventId
      }
    });
    if (!event) {
      return {
        status: 404,
        eventExisting: false,
        message: "Evento n\xE3o encontrado",
        error: "Erro Not Found"
      };
    }
    return {
      status: 200,
      eventExisting: true,
      error: false
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      eventExisting: false,
      message: "Erro ao consultar o evento",
      error: "Erro no servidor"
    };
  }
}

export {
  checkExistingEvent
};
