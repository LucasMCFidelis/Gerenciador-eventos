import {
  createEventRoute
} from "./chunk-KHRGVDHK.js";
import {
  deleteEventRoute
} from "./chunk-ES4OJF26.js";
import {
  getEventRoute
} from "./chunk-36FNZ6RK.js";
import {
  listEventRoute
} from "./chunk-3J7AKQVH.js";
import {
  UpdateEventRoute
} from "./chunk-PMVYLGUT.js";

// src/http/events/index.ts
async function eventRoutes(fastify) {
  fastify.register(createEventRoute);
  fastify.register(deleteEventRoute);
  fastify.register(getEventRoute);
  fastify.register(listEventRoute);
  fastify.register(UpdateEventRoute);
}

export {
  eventRoutes
};
