import { db } from "./createDatabase.js"
import { randomUUID } from "crypto"
import { schemaCadastro } from "./schemas/schemaCadastro.js"
import { schemaSenhaUsuario } from "./schemas/schemaSenhaUsuario.js"

export class Usuarios {
    async get(usuarioId, reply) {
        await db.get('SELECT id_usuario, nome, sobrenome, email FROM usuarios WHERE id_usuario = ?', [usuarioId], (error, row) => {
            if (error) {
                console.error(error.message)
                return reply.status(500).send({message: 'Erro ao consultar o usuário'})
            }

            if (!row) {
                return reply.status(404).send({message: 'Usuário não encontrado'})
            }

            return reply.status(200).send(row)
        })
    }
    
    async create(request, reply) {
        try {
            
            const {nome, sobrenome, email, telefone, senha} = request.body
            await schemaCadastro.validateAsync({nome, sobrenome, email, telefone})
            await schemaSenhaUsuario.validateAsync({senha})
            const usuarioId = randomUUID()
            
            await db.run('INSERT INTO usuarios (id_usuario, nome, sobrenome, email, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)', [usuarioId, nome, sobrenome, email, telefone, senha], (error) => {
                if (error) {
                    console.error(error.message)
                    return reply.status(500).send()
                }
                return reply.status(200).send(
                    {
                        nome, 
                        sobrenome, 
                        email, 
                        telefone
                    }
                )
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
                    return reply.status(500).send({ message: 'Erro ao consultar o Usuário' })
                }
    
                if (!row) {
                    return reply.status(404).send({ message: 'Usuário não encontrado' })
                }
    
                const value = await schemaCadastro.validateAsync(request.body)
                const { nome, sobrenome, email, telefone } = value
                await db.run(`
                    UPDATE usuarios 
                    SET nome = ?, sobrenome = ?, email = ?, telefone = ?
                    WHERE id_usuario = ?
                    `, [nome, sobrenome, email, telefone, usuarioId], (error) => {
                    if (error) {
                        console.error(error.message)
                        return reply.status(500).send({ message: 'Erro ao deletar usuário' })
                    }
                })
            })
        } catch (error) {
            return reply.status(400).send({
                error: 'Erro de validação',
                details: error.details.map(detail => detail.message)
            })
        }
    }

    async delete(usuarioId, reply) {
        await db.get('SELECT id_usuario, nome, sobrenome, email FROM usuarios WHERE id_usuario = ?', [usuarioId], async (error, row) => {
            if (error) {
                console.error(error.message)
                return reply.status(500).send({message: 'Erro ao consultar o usuário'})
            }
            
            if (!row) {
                return reply.status(404).send({message: 'Usuário não encontrado'})
            }
            
            await db.run('DELETE FROM usuarios WHERE id_usuario = ?', [usuarioId], (error)  => {
                if (error) {
                    console.error(error.message)
                    return reply.status(500).send({message: 'Erro ao deletar o usuário'})
                }
            })

            reply.status(204).send()
        })
    }
}