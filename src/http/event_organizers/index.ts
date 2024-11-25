import { FastifyInstance } from "fastify";
import { createEventOrganizerRoute } from "./createEventOrganizer.js";

export async function eventOrganizersRoutes(fastify:FastifyInstance) {
    fastify.register(createEventOrganizerRoute)
}