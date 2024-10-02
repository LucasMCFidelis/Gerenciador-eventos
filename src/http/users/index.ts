import { FastifyInstance } from "fastify";
import { createUserRoute } from "./createUserRoute.js";
import { deleteUserRoute } from "./deleteUserRoute.js";
import { getUserRoute } from "./getUserRoute.js";
import { loginUserRoute } from "./loginUserRoute.js";
import { updateUserPasswordRoute } from "./updateUserPasswordRoute.js";
import { updateUserRoute } from "./updateUserRoute.js";

export async function userRoutes(fastify:FastifyInstance) {
    fastify.register(createUserRoute)
    fastify.register(deleteUserRoute)
    fastify.register(getUserRoute)
    fastify.register(loginUserRoute)
    fastify.register(updateUserPasswordRoute)
    fastify.register(updateUserRoute)
}