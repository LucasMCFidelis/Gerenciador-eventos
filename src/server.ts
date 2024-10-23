import { fastify } from "fastify";
import { userRoutes } from "./http/users/index.js";  // Verifique se esse caminho está correto
import { eventRoutes } from "./http/events/index.js"; // Verifique se esse caminho está correto
import swagger from "@fastify/swagger";
import swaggerUi from '@fastify/swagger-ui';

const server = fastify();

// Registrar o plugin Swagger
server.register(swagger, {
    swagger: {
        info: {
            title: 'API de Gerenciamento de Eventos',
            description: 'Documentação da API usando Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3333',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
    }
});

// Registrar as rotas
server.register(userRoutes);
server.register(eventRoutes);

// Registrar o Swagger UI
server.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full', // Expande todas as seções por padrão
    },
  });

// Configurar a porta
const PORT = Number(process.env.PORT) || 3333;
server.listen({ port: PORT })
    .then(() => console.log(`
        Servidor rodando em http://localhost:${PORT}
        Documentação Swaagger em http://localhost:${PORT}/documentation
        `))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
