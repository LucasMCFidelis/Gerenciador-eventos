import { db } from "./createDatabase.js"
import { randomUUID } from "crypto"
import { schemaCadastro } from "./schemas/schemaCadastro.js"
import { schemaSenhaUsuario } from "./schemas/schemaSenhaUsuario.js"
import { handleError } from "./utils/handleError.js"

export class Usuarios {
    async get(request, reply) {
        try {         
            const {id, email} = request.params

            if (!id && !email) {
                return reply.status(400).send({message: 'ID ou Email devem ser fornecidos'})
            }
            
            const user = id ? await this.getUserById(id) : await this.getUserByEmail(email)
            
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }
    
            return reply.status(200).send(user)
        } catch (error) {
            return handleError(error, reply)
        }

    }
    async getUserById(usuarioId) {
        return new Promise((resolve, reject) => {
            db.get('SELECT id_usuario, nome, sobrenome, email FROM usuarios WHERE id_usuario = ?', [usuarioId], (error, row) => {
                if (error) {
                    console.error(error.message)
                    return reject(error)
                }
                if (!row) {
                    return resolve(null)
                }
                return resolve(row)
            })
        })
    }

    async getUserByEmail(usuarioEmail) {
        return new Promise((resolve, reject) => {
            db.get('SELECT id_usuario, nome, sobrenome, email FROM usuarios WHERE email = ?', [usuarioEmail], (error, row) => {
                if (error) {
                    console.error(error.message)
                    return reject(error)
                }
                if (!row) {
                    return resolve(null)
                }
                return resolve(row)
            })
        })
    }

    async create(request, reply) {
        try {
            const { nome, sobrenome, email, telefone, senha } = request.body
            await schemaCadastro.validateAsync({ nome, sobrenome, email, telefone })
            await schemaSenhaUsuario.validateAsync({ senha })
            const usuarioId = randomUUID()

            await db.run('INSERT INTO usuarios (id_usuario, nome, sobrenome, email, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)', [usuarioId, nome, sobrenome, email, telefone, senha])
            return reply.status(200).send({
                nome,
                sobrenome,
                email,
                telefone
            })
        } catch (error) {
            return handleError(error, reply)
        }
    }

    async update(request, reply) {
        try {
            const usuarioId = request.params.id
            const user = await this.getUserById(usuarioId)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            const value = await schemaCadastro.validateAsync(request.body)
            const { nome, sobrenome, email, telefone } = value
            await new Promise((resolve, reject) => {
                db.run(`
                    UPDATE usuarios 
                    SET nome = ?, sobrenome = ?, email = ?, telefone = ?
                    WHERE id_usuario = ?
                    `, [nome, sobrenome, email, telefone, usuarioId], (error) => {
                    if (error) return reject(error)
                    resolve()
                })
            })
            return reply.status(200).send({ message: 'Usuário atualizado com sucesso' })
        } catch (error) {
            return handleError(error, reply)
        }
    }

    async delete(usuarioId, reply) {
        try {
            const user = await this.getUserById(usuarioId)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }
            await db.run('DELETE FROM usuarios WHERE id_usuario = ?', [usuarioId])
            reply.status(204).send()
        } catch (error) {
            return handleError(error)
        }
    }
}