import { fastify } from "fastify"
import sqlite3 from 'sqlite3'
import { Eventos } from "./eventos.js"

const server = fastify()
export const db = new sqlite3.Database('eventos.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (error) => {
    if (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message)
        return
    }
    console.log('Conectado ao banco de dados.')
})
const eventos = new Eventos()

// db.run('drop table eventos')
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

server.listen({
    port: 3333,
})