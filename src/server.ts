import { fastify } from "fastify"
import { eventos } from "./http/eventos.js"
import { userRoutes } from "./http/users/index.js"

const server = fastify()
server.register(eventos)
server.register(userRoutes)

const PORT = Number(process.env.PORT) || 3333
server.listen({ port: PORT })
    .then(() => console.log(`Servidor rodando em http://localhost:${PORT}`))
    .catch((error) => {
        server.log.error(error)
        process.exit(1)
    })