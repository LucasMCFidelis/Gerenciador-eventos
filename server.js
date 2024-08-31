import { fastify } from "fastify"
import { DatabaseMemory } from "./database-memory.js"
import Joi from "joi"

const server = fastify()
const database = new DatabaseMemory()

const schemaEvento = Joi.object({
    title: Joi.string().min(3).required().messages({
        'string.base': 'Titulo deve ser uma string',
        'string.empty': 'Titulo não pode estar vazio'
    }),
    endereco: Joi.object({
        rua: Joi.string().required().messages({
            'string.base': 'Rua deve ser uma string',
            'string.empty': 'Rua não pode estar vazia' 
        }),
        numero: Joi.string().pattern(new RegExp('^[a-zA-Z0-9\s]+$')).required().messages({
            'string.base': 'Número deve ser uma string',
            'string.empty': 'Número não pode estar vazio',
            'string.pattern.base': 'Número deve conter apenas caracteres alfanuméricos'
        }),
        bairro: Joi.string().required().messages({
            'string.base': 'Bairro deve ser uma string',
            'string.empty': 'Bairro não pode estar vazia' 
        }),
    }).required(),
    data: Joi.string().pattern(new RegExp('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$')).required().messages({
        'string.base': 'Data deve ser uma string',
        'string.empty': 'Data não pode estar vazia',
        'string.pattern.base': 'Data deve estar no modelo (dd/mm/yyyy)'
    }),
    horario: Joi.string().pattern(new RegExp('^([01][0-9]|2[0-3]):([0-5][0-9])$')).required().messages({
        'string.base': 'Horário deve ser uma string',
        'string.empty': 'Horário não pode estar vazio',
        'string.pattern.base': 'Horário deve estar no modelo "hh:mm"'
    })
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