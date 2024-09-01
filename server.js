import { fastify } from "fastify"
import Joi from "joi"
import sqlite3 from 'sqlite3'
import { randomUUID } from "node:crypto"

const server = fastify()
const db = new sqlite3.Database('eventos.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message)
        return
    }
    console.log('Conectado ao banco de dados.')
})

db.run('drop table eventos')
db.run(`
    CREATE TABLE IF NOT EXISTS eventos (
        id_evento UUID,
        titulo VARCHAR(45) NOT NULL,
        rua VARCHAR(120) NOT NULL,
        numero VARCHAR(8) NOT NULL,
        bairro VARCHAR(20) NOT NULL,
        complemento VARCHAR(30),
        data_inicio CHAR(10) NOT NULL,
        horario CHAR(5) NOT NULL,
        CONSTRAINT pk_id_evento PRIMARY KEY (id_evento)
    )
`)

const schemaEvento = Joi.object({
    title: Joi.string().min(3).max(45).required().messages({
        'string.base': ('Titulo deve ser uma string').toLowerCase(),
        'string.empty': ('Titulo não pode estar vazio').toLowerCase(),
        'string.min': ('Titulo deve conter no mínimo 3 caracteres').toLowerCase(),
        'string.max': ('Titulo deve conter no máximo 45 caracteres').toLowerCase()

    }),
    endereco: Joi.object({
        rua: Joi.string().min(10).max(120).required().messages({
            'string.base': ('Rua deve ser uma string').toLowerCase(),
            'string.empty': ('Rua não pode estar vazia').toLowerCase(),
            'string.min': ('Rua deve conter no mínimo 10 caracteres').toLowerCase(),
            'string.max': ('Rua deve conter no máximo 120 caracteres').toLowerCase()
        }),
        numero: Joi.string().max(8).pattern(new RegExp('^[a-zA-Z0-9\s]+$')).required().messages({
            'string.base': ('Número deve ser uma string').toLowerCase(),
            'string.empty': ('Número não pode estar vazio').toLowerCase(),
            'string.pattern.base': ('Número deve conter apenas caracteres alfanuméricos').toLowerCase(),
            'string.max': ('Número deve conter no máximo 8 caracteres').toLowerCase()
        }),
        bairro: Joi.string().min(5).max(20).required().messages({
            'string.base': ('Bairro deve ser uma string').toLowerCase(),
            'string.empty': ('Bairro não pode estar vazio').toLowerCase(),
            'string.min': ('Bairro deve conter no mínimo 5 caracteres').toLowerCase(),
            'string.max': ('Bairro deve conter no máximo 20 caracteres').toLowerCase()
        }),
        complemento: Joi.string().max(30).messages({
            'string.base': ('Complemento deve ser uma string').toLowerCase(),
            'string.max': ('Complemento deve conter no máximo 30 caracteres').toLowerCase()
        }),
    }).required(),
    data: Joi.string().length(10).pattern(new RegExp('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\\d{4}$')).required().messages({
        'string.base': ('Data deve ser uma string').toLowerCase(),
        'string.empty': ('Data não pode estar vazia').toLowerCase(),
        'string.length': ('Data deve conter 10 caracteres').toLowerCase(),
        'string.pattern.base': ('Data deve estar no modelo (dd/mm/yyyy)').toLowerCase()
    }),
    horario: Joi.string().length(5).pattern(new RegExp('^([01][0-9]|2[0-3]):([0-5][0-9])$')).required().messages({
        'string.base': ('Horário deve ser uma string').toLowerCase(),
        'string.empty': ('Horário não pode estar vazio').toLowerCase(),
        'string.length': ('Horário deve conter 5 caracteres').toLowerCase(),
        'string.pattern.base': ('Horário deve estar no modelo (hh:mm)').toLowerCase()
    })
});

server.post('/eventos', async (request, reply) => {
    try {
        const value = await schemaEvento.validateAsync(request.body)
        const { title, endereco, data, horario } = value
        const { rua, numero, bairro } = endereco

        db.run('INSERT INTO eventos (id_evento, titulo, rua, numero, bairro, data_inicio, horario) VALUES (?, ?, ?, ?, ?, ?, ?)', [randomUUID(), title, rua, numero, bairro, data, horario], (error) => {
            if (error) {
                return reply.status(500).send({ message: 'Erro ao salvar evento' })
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

server.get('/eventos', (reply) => {
    db.all('SELECT * FROM eventos', (error, rows) => {
        if (error) {
            console.error(error.message)
            return reply.status(500).send({ message: 'Erro na consulta ao banco de dados' })
        }
        if (rows.length > 0) {
            return reply.status(200).send(rows)
        } else {
            return reply.status(404).send({ message: 'Nenhum evento encontrado' })
        }
    })
})

server.get('/eventos/:id', (request, reply) => {
    const eventoId = request.params.id
    db.get('SELECT * FROM eventos WHERE id_evento = ?', [eventoId], (error, row) => {
        if (error) {
            console.error(error.message)
            return reply.status(500).send({ message: 'Erro ao consultar o evento' })
        }
        if (!row) {
            return reply.status(404).send({ message: 'Evento não encontrado' })
        }

        return reply.status(200).send(row)
    })
})

server.put('/eventos/:id', (request, reply) => {
    try {
        const eventoId = request.params.id;

        db.get('SELECT id_evento FROM eventos WHERE id_evento = ?', [eventoId], async (error, row) => {
            if (error) {
                console.error(error.message)
                return reply.status(500).send({ message: 'Erro ao consultar o evento' })
            }

            if (!row) {
                return reply.status(404).send({ message: 'Evento não encontrado' })
            }

            const value = await schemaEvento.validateAsync(request.body);
            const { title, endereco, data, horario } = value;
            const { rua, numero, bairro } = endereco;
            db.run(`
                UPDATE eventos 
                SET titulo = ?, rua = ?, numero = ?, bairro = ?, data_inicio = ?, horario = ?
                WHERE id_evento = ?
                `, [title, rua, numero, bairro, data, horario, eventoId], (error) => {
                if (error) {
                    console.error(error.message)
                    return reply.status(500).send({ message: 'Erro ao deletar evento' })
                }
            })

            reply.status(204).send()
        })

    } catch (error) {
        return reply.status(400).send({
            error: 'Erro de validação',
            code: 400,
            details: error.details.map(detail => detail.message)
        });
    }
});

server.delete('/eventos/:id', (request, reply) => {
    const eventoId = request.params.id
    db.get('SELECT id_evento FROM eventos WHERE id_evento = ?', [eventoId], (error, row) => {
        if (error) {
            console.error(error.message)
            return reply.status(500).send({ message: 'Erro ao consultar o evento' })
        }

        if (!row) {
            return reply.status(404).send({ message: 'Evento não encontrado' })
        }

        db.run('DELETE FROM eventos WHERE id_evento = ?', [eventoId], (error) => {
            if (error) {
                console.error(error.message)
                return reply.status(500).send({ message: 'Erro ao deletar evento' })
            }
        })

        reply.status(204).send()
    })
})

server.listen({
    port: 3333,
})