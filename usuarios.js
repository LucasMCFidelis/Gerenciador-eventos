import { db } from "./createDatabase.js"
import { randomUUID } from "crypto"
import { schemaCadastro } from "./schemas/schemaCadastro.js"
import { schemaSenhaUsuario } from "./schemas/schemaSenhaUsuario.js"
import { handleError } from "./utils/handleError.js"

async function getUserById(usuarioId) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id_usuario, nome, sobrenome, email FROM usuarios WHERE id_usuario = ?', [usuarioId], (error, row) => {
            if (error) {
                console.error(error.message)
                return reject(error)
            }
            resolve(row || null)
        })
    })
}

async function getUserByEmail(usuarioEmail) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id_usuario, nome, sobrenome, email FROM usuarios WHERE email = ?', [usuarioEmail], (error, row) => {
            if (error) {
                console.error(error.message)
                return reject(error)
            }
            resolve(row || null)
        })
    })
}

export async function usuarios(fastify, options) {
    fastify.get('/usuarios/id/:id', async (request, reply) => {
        try {
            const { id } = request.params
            if (!id) {
                return reply.status(400).send({ message: 'ID deve ser fornecido' })
            }

            const user = await getUserById(id)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            return reply.status(200).send(user)
        } catch (error) {
            return handleError(error, reply)
        }
    })

    fastify.get('/usuarios/email/:email', async (request, reply) => {
        try {
            const { email } = request.params
            if (!email) {
                return reply.status(400).send({ message: 'Email deve ser fornecido' })
            }

            const user = await getUserByEmail(email)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            return reply.status(200).send(user)
        } catch (error) {
            return handleError(error, reply)
        }
    })

    fastify.post('/usuarios', async (request, reply) => {
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
    })

    fastify.put('/usuarios/id/:id', async (request, reply) => {
        try {
            const usuarioId = request.params.id
            const user = await getUserById(usuarioId)
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
    })

    fastify.delete('/usuarios/id/:id', async (request, reply) => {
        try {
            const usuarioId = request.params.id
            const user = await getUserById(usuarioId)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }
            await db.run('DELETE FROM usuarios WHERE id_usuario = ?', [usuarioId])
            reply.status(204).send()
        } catch (error) {
            return handleError(error)
        }
    })
}