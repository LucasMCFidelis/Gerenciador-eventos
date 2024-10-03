import { fastify } from "fastify"
import { userRoutes } from "./http/users/index.js"
import { eventRoutes } from "./http/events/index.js"

const server = fastify()
server.register(userRoutes)
server.register(eventRoutes)

const PORT = Number(process.env.PORT) || 3333
server.listen({ port: PORT })
    .then(() => console.log(`Servidor rodando em http://localhost:${PORT}`))
    .catch((error) => {
        server.log.error(error)
        process.exit(1)
    })