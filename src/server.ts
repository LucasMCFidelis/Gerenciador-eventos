import fastify from "fastify";
import { userRoutes } from "./http/users/index.js";
import { eventRoutes } from "./http/events/index.js";
import swagger from "@fastify/swagger";
import swaggerUi from '@fastify/swagger-ui';
import path from 'path';
import { fileURLToPath } from 'url';
import authPlugin from './plugins/auth.js';


// Obter o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = fastify();

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
  routePrefix: '/docs', // Prefixo para acessar a UI da documentação
  uiConfig: {
    docExpansion: 'none',
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

// Configurar a porta
const PORT = Number(process.env.PORT) || 3333;
server.listen({ port: PORT })
  .then(() => console.log(`
        Servidor rodando em http://localhost:${PORT}
        Documentação Swagger em http://localhost:${PORT}/docs
        `))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });