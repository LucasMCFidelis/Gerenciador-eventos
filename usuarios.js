import { db } from "./createDatabase.js"
import { randomUUID } from "crypto"
import { schemaCadastro } from "./schemas/schemaCadastro.js"


export class Usuarios {
    async get(usuarioId, reply) {
        await db.get('SELECT id_usuario, nome, sobrenome, email FROM usuarios WHERE id_usuario = ?', [usuarioId], (error, row) => {
            if (error) {
                console.error(error.message)
                return reply.status(500).send({message: 'Erro ao consultar o evento'})
            }

            if (!row) {
                console.error(error.message)
                return reply.status(404).send({message: 'Evento não encontrado'})
            }

            return reply.status(200).send(row)
        })
    }
    
    async create(request, reply) {
        try {
            const value = await schemaCadastro.validateAsync(request.body)
            const usuarioId = randomUUID()
            const {nome, sobrenome, email, telefone, senha} = value
            await db.run('INSERT INTO usuarios (id_usuario, nome, sobrenome, email, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)', [usuarioId, nome, sobrenome, email, telefone, senha], (error) => {
                if (error) {
                    console.error(error.message)
                    return reply.status(500).send()
                }
                return reply.status(200).send(value)
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
            const usuarioId = request.params.id
            await db.get('SELECT id_usuario, nome, sobrenome, email FROM usuarios WHERE id_usuario = ?', [usuarioId], async (error, row) => {
                if (error) {
                    console.error(error.message)
                    return reply.status(500).send({ message: 'Erro ao consultar o evento' })
                }
    
                if (!row) {
                    console.error(error.message)
                    return reply.status(404).send({ message: 'Evento não encontrado' })
                }
    
                const value = await schemaCadastro.validateAsync(request.body)
                const { nome, sobrenome, email, telefone, senha } = value
                await db.run(`
                    UPDATE usuarios 
                    SET nome = ?, sobrenome = ?, email = ?, telefone = ?, 
                    WHERE id_evento = ?
                    `, [nome, sobrenome, email, telefone, usuarioId], (error) => {
                    if (error) {
                        console.error(error.message)
                        return reply.status(500).send({ message: 'Erro ao deletar evento' })
                    }
                })
            })
        } catch (error) {
            return reply.status(400).send({
                error: 'Erro de validação',
                code: 400,
                details: error.details.map(detail => detail.message)
            })
        }
    }

    async delete(eventoId, reply) {
        
    }
}