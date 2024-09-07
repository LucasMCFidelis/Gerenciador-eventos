import { fastify } from "fastify"
import { Eventos } from "./eventos.js"
import { Usuarios } from "./usuarios.js"
import { schemaCadastro } from "./schemas/schemaCadastro.js"
import { db } from "./createDatabase.js"

const server = fastify()
const eventos = new Eventos()
const usuarios = new Usuarios()

server.post('/eventos', async (request, reply) => {
    eventos.create(request, reply)
})

server.get('/eventos', (request, reply) => {
    eventos.list(request, reply)
})

server.get('/eventos/:id', (request, reply) => {
    const eventoId = request.params.id
    eventos.get(eventoId, reply)
})

server.put('/eventos/:id', (request, reply) => {
    eventos.update(request, reply)
})

server.delete('/eventos/:id', (request, reply) => {
    const eventoId = request.params.id
    eventos.delete(eventoId, reply)
})

server.get('/usuarios/id/:id', (request, reply) => {
    const usuarioId = request.params.id
    usuarios.get(usuarioId, reply)
})

server.post('/usuarios', (request, reply) => {
    usuarios.create(request, reply)
})

server.put('/usuarios/id/:id', async (request, reply) => {
    usuarios.update(request, reply)
})

server.delete('/usuarios/id/:id', (request, reply) => {
    const usuarioId = request.params.id
    usuarios.delete(usuarioId, reply)
})

server.listen({
    port: 3333,
})