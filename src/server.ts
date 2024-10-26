import fastify from "fastify";
import { userRoutes } from "./http/users/index.js";
import { eventRoutes } from "./http/events/index.js";
import swagger from "@fastify/swagger";
import swaggerUi from '@fastify/swagger-ui';

const server = fastify();

// Registrar o Swagger
server.register(swagger, {
  openapi: {
    info: {
      title: 'API de Gerenciamento de Eventos',
      description: 'Documentação da API usando Swagger',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor local',
      },
    ],
    tags: [
      {
        name: 'Usuários',
        description: 'Operações de gerenciamento de usuários',
      },
      {
        name: 'Eventos',
        description: 'Operações relacionadas a eventos',
      },
    ],
    components: {
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            message: { type: "string", example: "Descrição do erro" },
          },
        },
      },
    }
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