import { fastify } from "fastify"
import { DatabaseMemory } from "./database-memory.js"

const server = fastify()
const database = new DatabaseMemory()

server.post('/eventos', (request, reply) => {
    const {title, endereco, data, horario} = request.body
    const {rua, numero, bairro} = endereco
    database.create({
        title,
        endereco : {
            rua,
            numero,
            bairro
        },
        data,
        horario,
    })
    
    return reply.status(201).send()
})

server.get('/eventos', () => {
    const eventos = database.list()
    return eventos
})

server.put('/eventos/:id', (request, reply) => {
    const eventoId = request.params.id
    const {title, endereco, data, horario} = request.body
    const {rua, numero, bairro} = endereco

    database.update(eventoId, {
        title,
        endereco : {
            rua,
            numero,
            bairro
        },
        data,
        horario,
    })
    
    return reply.status(204).send()
})

server.delete('/eventos/:id', (request, reply) => {
    const eventoId = request.params.id
    database.delete(eventoId)
    
    return reply.status(204).send()
})

server.listen({
    port: 3333,
})