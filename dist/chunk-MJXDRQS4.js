import {
  getUserRoute
} from "./chunk-WPE4J6AJ.js";
import {
  loginUserRoute
} from "./chunk-37XH3XPW.js";
import {
  sendRecoveryCodeRoute
} from "./chunk-ZKAI5QTQ.js";
import {
  updateUserPasswordRoute
} from "./chunk-UXNLFZ6Z.js";
import {
  updateUserRoleRoute
} from "./chunk-ARBLY6FI.js";
import {
  updateUserRoute
} from "./chunk-V4B4CWKD.js";
import {
  createUserRoute
} from "./chunk-JIHTEU2L.js";
import {
  deleteUserRoute
} from "./chunk-CKMS5G3Y.js";

// src/http/users/index.ts
async function userRoutes(fastify) {
  fastify.register(createUserRoute);
  fastify.register(deleteUserRoute);
  fastify.register(getUserRoute);
  fastify.register(loginUserRoute);
  fastify.register(updateUserPasswordRoute);
  fastify.register(updateUserRoute);
  fastify.register(updateUserRoleRoute);
  fastify.register(sendRecoveryCodeRoute);
}

export {
  userRoutes
};
