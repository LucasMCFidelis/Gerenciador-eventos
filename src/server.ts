import { fastify } from "fastify";
import { userRoutes } from "./http/users/index.js";  // Verifique se esse caminho está correto
import { eventRoutes } from "./http/events/index.js"; // Verifique se esse caminho está correto
import swagger from "@fastify/swagger";
import swaggerUi from '@fastify/swagger-ui';
import { swaggerDocs } from "./utils/swagger.js";

const server = fastify();

// Registrar as rotas
server.register(userRoutes);
server.register(eventRoutes);

// Registrar Swagger e Swagger UI após as rotas
server.register(swagger, {
    swagger: swaggerDocs,
});

// Registrar o Swagger UI
server.register(swaggerUi, {
    routePrefix: '/docs', 
    uiConfig: {
        docExpansion: 'none', 
        deepLinking: false,
    },
    staticCSP: true, 
    transformSpecificationClone: true,
});

// Configurar a porta
const PORT = Number(process.env.PORT) || 3333;
server.listen({ port: PORT })
    .then(() => console.log(`
        Servidor rodando em http://localhost:${PORT}
        Documentação Swaagger em http://localhost:${PORT}/docs
        `))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
