import { fastify } from "fastify"
import { usuarios } from "./usuarios.js"
import { eventos } from "./eventos.js"

const server = fastify()
server.register(eventos)
server.register(usuarios)

server.listen({
    port: 3333,
})