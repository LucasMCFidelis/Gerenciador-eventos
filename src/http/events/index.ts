import { FastifyInstance } from "fastify"
import { createEventRoute } from "./createEventRoute.js"
import { deleteEventRoute } from "./deleteEventRoute.js"
import { getEventRoute } from "./getEventRoute.js"
import { listEventRoute } from "./listEventsRoute.js"
import { UpdateEventRoute } from "./updateEventRoute.js"

export async function eventRoutes(fastify: FastifyInstance) {
    fastify.register(createEventRoute)
    fastify.register(deleteEventRoute)
    fastify.register(getEventRoute)
    fastify.register(listEventRoute)
    fastify.register(UpdateEventRoute)
}