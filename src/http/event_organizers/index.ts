import { FastifyInstance } from "fastify";
import { createEventOrganizerRoute } from "./createEventOrganizer.js";
import { listEventOrganizersRoute } from "./listEventOrganizers.js";
import { deleteEventOrganizerRoute } from "./deleteEventOrganizerRoute.js";
import { UpdateEventOrganizerRoute } from "./updateEventOrganizerRoute.js";

export async function eventOrganizersRoutes(fastify:FastifyInstance) {
    fastify.register(createEventOrganizerRoute)
    fastify.register(listEventOrganizersRoute)
    fastify.register(deleteEventOrganizerRoute)
    fastify.register(UpdateEventOrganizerRoute)
}