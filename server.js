import { fastify } from "fastify"
import { DatabaseMemory } from "./database-memory.js"
import Joi from "joi"

const server = fastify()
const database = new DatabaseMemory()

const schemaEvento = Joi.object({
    title: Joi.string().min(3).required(),
    endereco: Joi.object({
        rua: Joi.string().required(),
        numero: Joi.number().required(),
        bairro: Joi.string().required()
    }).required(),
    data: Joi.string().required(),
    horario: Joi.string().required()
});

server.post('/eventos', async (request, reply) => {
    try{
        const value = await schemaEvento.validateAsync(request.body)
        const {title, endereco, data, horario} = value
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
        
        return reply.status(201).send(value)
    } catch (error) {
        return reply.status(400).send({
            error: "Erro de validação",
            details: error.details.map(detail => detail.message)
        })
    }
})

server.get('/eventos', () => {
    const eventos = database.list()
    return eventos
})

server.put('/eventos/:id', async (request, reply) => {
    try {
        const eventoId = request.params.id
        const value = await schemaEvento.validateAsync(request.body)
        const {title, endereco, data, horario} = value
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
        
        return reply.status(204).send(value)
    } catch (error) {
        return reply.status(400).send({
            error: "Erro de validação",
            details: error.details.map(detail => detail.message)
        })
    }
})

server.delete('/eventos/:id', (request, reply) => {
    const eventoId = request.params.id
    database.delete(eventoId)
    
    return reply.status(204).send()
})

server.listen({
    port: 3333,
})