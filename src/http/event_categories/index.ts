import { FastifyInstance } from "fastify";
import { createEventCategoryRoute } from "./createEventCategory.js";

export async function eventCategoryRoutes(fastify:FastifyInstance) {
    fastify.register(createEventCategoryRoute)
}