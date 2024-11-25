import { FastifyInstance } from "fastify";
import { createEventOrganizerRoute } from "./createEventOrganizer.js";
import { listEventOrganizersRoute } from "./listEventOrganizers.js";

export async function eventOrganizersRoutes(fastify:FastifyInstance) {
    fastify.register(createEventOrganizerRoute)
    fastify.register(listEventOrganizersRoute)
}