import { fastify } from "fastify"
import { usuarios } from "./http/usuarios.js"
import { eventos } from "./http/eventos.js"

const server = fastify()
server.register(eventos)
server.register(usuarios)

server.listen({
    port: 3333,
})