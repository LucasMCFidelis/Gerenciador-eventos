import {
  userRoutes
} from "./chunk-MJXDRQS4.js";
import "./chunk-WPE4J6AJ.js";
import "./chunk-37XH3XPW.js";
import "./chunk-SZ6BW6KZ.js";
import "./chunk-BKI6JQ6F.js";
import "./chunk-ZKAI5QTQ.js";
import "./chunk-TPCEKKVW.js";
import "./chunk-6CS7EY42.js";
import "./chunk-UXNLFZ6Z.js";
import "./chunk-CQ726DUO.js";
import "./chunk-7EOILMO7.js";
import "./chunk-6GABII7F.js";
import "./chunk-ARBLY6FI.js";
import "./chunk-H34GZ3OM.js";
import "./chunk-V4B4CWKD.js";
import {
  eventRoutes
} from "./chunk-G65AFOVC.js";
import "./chunk-KHRGVDHK.js";
import "./chunk-ES4OJF26.js";
import "./chunk-36FNZ6RK.js";
import "./chunk-BMA7U7YX.js";
import "./chunk-ATUXTFRN.js";
import "./chunk-3J7AKQVH.js";
import "./chunk-PMVYLGUT.js";
import "./chunk-JQWT63BZ.js";
import "./chunk-WAXIKHJ4.js";
import "./chunk-JIHTEU2L.js";
import "./chunk-LPPX337Y.js";
import "./chunk-LJXII5C6.js";
import "./chunk-CKMS5G3Y.js";
import "./chunk-QOW2YV2H.js";
import "./chunk-HVJ57BPC.js";
import "./chunk-ZOAOPETN.js";
import "./chunk-KRHBA2SY.js";
import {
  auth_default
} from "./chunk-BGQAG4NY.js";
import "./chunk-JYXM2VRB.js";
import "./chunk-D2ZSRSED.js";
import "./chunk-ILEFH35N.js";
import "./chunk-PCLMAWZP.js";
import "./chunk-LXJDJKI7.js";
import "./chunk-ELLFQHHN.js";
import "./chunk-XITV7NGF.js";
import "./chunk-LYKEYNKQ.js";
import "./chunk-JSBRDJBE.js";

// src/server.ts
import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var server = fastify();
server.register(swagger, {
  mode: "static",
  specification: {
    path: path.join(__dirname, "swagger.yaml"),
    baseDir: __dirname
  }
});
server.register(swaggerUi, {
  routePrefix: "/docs",
  // Prefixo para acessar a UI da documentação
  uiConfig: {
    docExpansion: "none",
    deepLinking: false
  },
  staticCSP: true,
  transformSpecificationClone: true
});
server.register(auth_default);
server.register(userRoutes);
server.register(eventRoutes);
var PORT = Number(process.env.PORT) || 3333;
var HOST = process.env.HOST || "localhost";
server.listen({ port: PORT, host: HOST }).then(() => console.log(`
        Servidor rodando em http://${HOST}:${PORT}
        Documenta\xE7\xE3o Swagger em http://${HOST}:${PORT}/docs
        `)).catch((error) => {
  console.error(error);
  process.exit(1);
});
