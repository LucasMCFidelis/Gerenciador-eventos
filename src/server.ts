import { fastify } from "fastify"
import { userRoutes } from "./http/users/index.js"
import { eventRoutes } from "./http/events/index.js"
import swagger from "@fastify/swagger"

const server = fastify()

// Configuração do Swagger
server.register(swagger, {
    swagger: {
        info: {
            title: 'API do Catálogo de Eventos',
            description: 'Documentação da API',
            version: '1.0.0',
        },
        host: 'localhost:3333',
        schemes: ['http'],
        consumes: ['application/json'],
        produces: ['application/json'],
    },
})

// Registrar as rotas
server.register(userRoutes)
server.register(eventRoutes)

// Configurar a rota de documentação
server.get('/documentation', async (request, reply) => {
    reply.send(server.swagger())
})

// Iniciar o servidor
const PORT = Number(process.env.PORT) || 3333
server.listen({ port: PORT })
    .then(() => console.log(`
        Servidor rodando em http://localhost:${PORT}
        Documentação Swagger em http://localhost:${PORT}/documentation
        `))
    .catch((error) => {
        server.log.error(error)
        process.exit(1)
    })