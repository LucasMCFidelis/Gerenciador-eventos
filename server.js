import { fastify } from "fastify"
import { DatabaseMemory } from "./database-memory.js"
import Joi from "joi"
import sqlite3 from 'sqlite3'
import { randomUUID } from "node:crypto"

const server = fastify()
const database = new DatabaseMemory()
const db = new sqlite3.Database('eventos.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message)
        return
    }
    console.log('Conectado ao banco de dados.')
})

db.run(`
    CREATE TABLE IF NOT EXISTS eventos (
        id_evento UUID,
        titulo VARCHAR(45) NOT NULL,
        rua VARCHAR(45) NOT NULL,
        numero VARCHAR(45) NOT NULL,
        bairro VARCHAR(20) NOT NULL,
        complemento VARCHAR(45),
        data_inicio DATE NOT NULL,
        horario TIMESTAMP NOT NULL,
        CONSTRAINT pk_id_evento PRIMARY KEY (id_evento)
    )
`)
// db.run('drop table eventos')

const schemaEvento = Joi.object({
    title: Joi.string().min(3).required().messages({
        'string.base': ('Titulo deve ser uma string').toLowerCase(),
        'string.empty': ('Titulo não pode estar vazio').toLowerCase()
    }),
    endereco: Joi.object({
        rua: Joi.string().required().messages({
            'string.base': ('Rua deve ser uma string').toLowerCase(),
            'string.empty': ('Rua não pode estar vazia').toLowerCase()
        }),
        numero: Joi.string().pattern(new RegExp('^[a-zA-Z0-9\s]+$')).required().messages({
            'string.base': ('Número deve ser uma string').toLowerCase(),
            'string.empty': ('Número não pode estar vazio').toLowerCase(),
            'string.pattern.base': ('Número deve conter apenas caracteres alfanuméricos').toLowerCase()
        }),
        bairro: Joi.string().required().messages({
            'string.base': ('Bairro deve ser uma string').toLowerCase(),
            'string.empty': ('Bairro não pode estar vazio').toLowerCase()
        }),
    }).required(),
    data: Joi.string().pattern(new RegExp('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$')).required().messages({
        'string.base': ('Data deve ser uma string').toLowerCase(),
        'string.empty': ('Data não pode estar vazia').toLowerCase(),
        'string.pattern.base': ('Data deve estar no modelo (dd/mm/yyyy)').toLowerCase()
    }),
    horario: Joi.string().pattern(new RegExp('^([01][0-9]|2[0-3]):([0-5][0-9])$')).required().messages({
        'string.base': ('Horário deve ser uma string').toLowerCase(),
        'string.empty': ('Horário não pode estar vazio').toLowerCase(),
        'string.pattern.base': ('Horário deve estar no modelo (hh:mm)').toLowerCase()
    })
});

server.post('/eventos', async (request, reply) => {
    try {
        const value = await schemaEvento.validateAsync(request.body)
        const { title, endereco, data, horario } = value
        const { rua, numero, bairro } = endereco
        
        db.run(`INSERT INTO eventos (id_evento, titulo, rua, numero, bairro, data_inicio, horario) VALUES (?, ?, ?, ?, ?, ?, ?)`, [randomUUID(), title, rua, numero, bairro, data, horario], (error) => {
            if (error) {
                return reply.status(500).send({message: 'Erro ao salvar evento'})
            }
            reply.status(200).send(value)
        })

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
        const { title, endereco, data, horario } = value
        const { rua, numero, bairro } = endereco

        database.update(eventoId, {
            title,
            endereco: {
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