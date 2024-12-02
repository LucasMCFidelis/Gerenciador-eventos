import { FastifyInstance } from "fastify";
import { createEventCategoryRoute } from "./createEventCategory.js";
import { listEventCategoriesRoute } from "./listEventCategories.js";
import { deleteEventCategoryRoute } from "./deleteEventCategoryRoute.js";

export async function eventCategoryRoutes(fastify:FastifyInstance) {
    fastify.register(createEventCategoryRoute)
    fastify.register(listEventCategoriesRoute)
    fastify.register(deleteEventCategoryRoute)
}