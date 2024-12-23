import fastify from "fastify";
import { userRoutes } from "./http/users/index.js";
import { eventRoutes } from "./http/events/index.js";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import path from "path";
import { fileURLToPath } from "url";
import authPlugin from "./plugins/auth.js";
import cors from "@fastify/cors";
import { eventOrganizersRoutes } from "./http/event_organizers/index.js";
import { eventCategoryRoutes } from "./http/event_categories/index.js";

// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify();

// Configurar o CORS
server.register(cors, {
  origin: "*", // Libera totalmente para testes
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});

// Registrar o Swagger
server.register(swagger, {
  mode: "static",
  specification: {
    path: path.join(__dirname, "swagger.yaml"),
    baseDir: __dirname,
  },
});

// Registrar o Swagger UI
server.register(swaggerUi, {
  routePrefix: "/docs", // Prefixo para acessar a UI da documentação
  uiConfig: {
    docExpansion: "none",
    deepLinking: false,
  },
  staticCSP: true,
  transformSpecificationClone: true,
});

// Registrar plugin de autenticação
server.register(authPlugin);

// Registrar as rotas
server.register(userRoutes);
server.register(eventRoutes);
server.register(eventOrganizersRoutes);
server.register(eventCategoryRoutes);

// Configurar a porta e host
const PORT = Number(process.env.PORT) || 3333;
const HOST = process.env.HOST || "localhost";

server
  .listen({ port: PORT, host: HOST })
  .then(() =>
    console.log(`
        Servidor rodando em http://${HOST}:${PORT}
        Documentação Swagger em http://${HOST}:${PORT}/docs
        `)
  )
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
