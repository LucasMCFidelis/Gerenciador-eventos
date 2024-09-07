import { db } from "./createDatabase.js"
import { schemaEvento } from "./schemas/schemaEvento.js"
import { randomUUID } from "crypto"

export class Eventos {
    async list(request, reply) {
        await db.all('SELECT * FROM eventos', (error, rows) => {
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
    }

    async get(eventoId, reply) {
        await db.get('SELECT * FROM eventos WHERE id_evento = ?', [eventoId], (error, row) => {
            if (error) {
                console.error(error.message)
                return reply.status(500).send({ message: 'Erro ao consultar o evento' })
            }
            if (!row) {
                return reply.status(404).send({ message: 'Evento não encontrado' })
            }

            return reply.status(200).send(row)
        })
    }

    async create(request, reply) {
        try {
            const value = await schemaEvento.validateAsync(request.body)
            const id_evento = randomUUID()
            const { title, endereco, data, horario } = value
            const { rua, numero, bairro } = endereco
            await db.run('INSERT INTO eventos (id_evento, titulo, rua, numero, bairro, data_inicio, horario) VALUES (?, ?, ?, ?, ?, ?, ?)', [id_evento, title, rua, numero, bairro, data, horario], (error) => {
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
    }

    async update(request, reply) {
        try {
            const eventoId = request.params.id;

            await db.get('SELECT id_evento FROM eventos WHERE id_evento = ?', [eventoId], async (error, row) => {
                if (error) {
                    console.error(error.message)
                    return reply.status(500).send({ message: 'Erro ao consultar o evento' })
                }

                if (!row) {
                    return reply.status(404).send({ message: 'Evento não encontrado' })
                }

                const value = await schemaEvento.validateAsync(request.body)
                const { title, endereco, data, horario } = value;
                const { rua, numero, bairro } = endereco;
                await db.run(`
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
                details: error.details.map(detail => detail.message)
            })
        }
    }

    async delete(eventoId, reply) {
        await db.get('SELECT id_evento FROM eventos WHERE id_evento = ?', [eventoId], async (error, row) => {
            if (error) {
                console.error(error.message)
                return reply.status(500).send({ message: 'Erro ao consultar o evento' })
            }

            if (!row) {
                return reply.status(404).send({ message: 'Evento não encontrado' })
            }

            await db.run('DELETE FROM eventos WHERE id_evento = ?', [eventoId], (error) => {
                if (error) {
                    console.error(error.message)
                    return reply.status(500).send({ message: 'Erro ao deletar evento' })
                }
            })

            reply.status(204).send()
        })
    }

}