import { db } from "../createDatabase.js"
import { randomUUID } from "crypto"
import bcrypt from "bcrypt"
import { schemaCadastro } from "../schemas/schemaCadastro.js"
import { schemaSenhaUsuario } from "../schemas/schemaSenhaUsuario.js"
import { handleError } from "../utils/handleError.js"
import { FastifyInstance } from "fastify"

interface Usuario {
    id_usuario: string
    nome: string
    sobrenome: string
    email: string
    telefone?: number
}

interface Cadastro {
    nome: string
    sobrenome: string
    email: string
    telefone?: number
    senha: string
}

interface UserAutentication {
    id_usuario: string
    email: string
    senha: string
}

async function getUserById(userId: string): Promise<Usuario | null> {
    return new Promise((resolve, reject) => {
        db.get('SELECT id_usuario, nome, sobrenome, email, telefone FROM usuarios WHERE id_usuario = ?', [userId], (error: Error | null, row: any) => {
            if (error) {
                console.error(error.message)
                return reject(error)
            }

            if (row && typeof row.id_usuario === 'string' && typeof row.email === 'string' && typeof row.senha === 'string') {
                resolve({
                    id_usuario: row.id_usuario,
                    nome: row.nome,
                    sobrenome: row.sobrenome,
                    email: row.email,
                    telefone: row.telefone
                })
            } else {
                resolve(null)
            }
        })
    })
}

async function getUserByEmail(userEmail: string): Promise<UserAutentication | null> {
    return new Promise((resolve, reject) => {
        db.get('SELECT id_usuario, email, senha FROM usuarios WHERE email = ?', [userEmail], (error: Error | null, row: any) => {
            if (error) {
                console.error(error.message)
                return reject(error)
            }

            if (row && typeof row.id_usuario === 'string' && typeof row.email === 'string' && typeof row.senha === 'string') {
                resolve({
                    id_usuario: row.id_usuario,
                    email: row.email,
                    senha: row.senha
                })
            } else {
                resolve(null)
            }
        })
    })
}

async function hashPassword(password: string) {
    const saltHounds = 10
    return await bcrypt.hash(password, saltHounds)
}

async function comparePasswords(passwordProvided: string, passwordHash: string) {
    return await bcrypt.compare(passwordProvided, passwordHash)
}

async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
    const newPasswordHash = await hashPassword(newPassword)
    return new Promise((resolve, reject) => {
        db.run(`
            UPDATE usuarios
            SET senha = ? 
            WHERE id_usuario = ?
        `, [newPasswordHash, userId], (error: Error) => {
            if (error) return reject(error)
            resolve()
        })
    })
}

export async function usuarios(fastify: FastifyInstance) {
    fastify.get('/usuarios/id/:id', async (request, reply) => {
        try {
            const { id } = request.params as { id: string }
            if (!id) {
                return reply.status(400).send({ message: 'ID deve ser fornecido' })
            }

            const user = await getUserById(id)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            return reply.status(200).send(user)
        } catch (error: unknown) {
            return handleError(error, reply)
        }
    })

    fastify.post('/usuarios', async (request, reply) => {
        try {
            const { nome, sobrenome, email, telefone, senha } = request.body as Cadastro
            await schemaCadastro.validateAsync({ nome, sobrenome, email, telefone })
            await schemaSenhaUsuario.validateAsync({ senha })
            const usuarioId = randomUUID()
            const senhaHash = await hashPassword(senha)

            const existingUser = await new Promise((resolve, reject) => {
                db.get('SELECT email FROM usuarios WHERE email = ?', [email], (error, row) => {
                    if (error) {
                        return reject(error)
                    }
                    resolve(row)
                })
            })

            if (existingUser) {
                return reply.status(400).send({ message: 'Este email já está cadastrado' })
            }

            db.run('INSERT INTO usuarios (id_usuario, nome, sobrenome, email, telefone, senha) VALUES (?, ?, ?, ?, ?, ?)', [usuarioId, nome, sobrenome, email, telefone, senhaHash], (error: Error) => {
                if (error) {
                    console.error(error)
                    return reply.status(500).send({ message: 'Erro ao salvar cadastro' })
                }
                return reply.status(200).send({
                    usuarioId,
                    nome,
                    sobrenome,
                    email,
                    telefone
                })
            })

        } catch (error) {
            return handleError(error, reply)
        }
    })

    fastify.put('/usuarios/id/:id', async (request, reply) => {
        try {
            const userId = (request.params as { id: string }).id
            const user = await getUserById(userId)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            const value = await schemaCadastro.validateAsync(request.body)
            const { nome, sobrenome, email, telefone } = value
            await new Promise<void>((resolve, reject) => {
                db.run(`
                    UPDATE usuarios 
                    SET nome = ?, sobrenome = ?, email = ?, telefone = ?
                    WHERE id_usuario = ?
                    `, [nome, sobrenome, email, telefone, userId], (error: Error) => {
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
            const usuarioId = (request.params as { id: string }).id
            const user = await getUserById(usuarioId)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }
            await db.run('DELETE FROM usuarios WHERE id_usuario = ?', [usuarioId])
            reply.status(204).send()
        } catch (error) {
            return handleError(error, reply)
        }
    })

    // ADICIONAR VALIDAÇÃO POR CÓDIGO EM EMAIL OU ALGUMA OUTRA OPÇÃO
    fastify.patch('/usuarios/recuperacao/esqueci-senha', async (request, reply) => {
        try {
            const { email, novaSenha } = request.body as { email: string, novaSenha: string }
            const user = await getUserByEmail(email)

            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            await schemaSenhaUsuario.validateAsync({ senha: novaSenha })
            await updateUserPassword(user.id_usuario, novaSenha)

            return reply.status(200).send({ message: 'Senha atualizada com sucesso' })
        } catch (error) {
            return handleError(error, reply)
        }
    })

    // ADICIONAR LOGICA DE CRIAÇÃO DE TOKENS PARA PRÓXIMAS AUTENTICAÇÕES 
    fastify.post('/usuarios/login', async (request, reply) => {
        try {
            const { email, senhaFornecida } = request.body as { email: string, senhaFornecida: string }

            const user = await getUserByEmail(email)

            if (!user) {
                return reply.status(401).send({ message: 'Credenciais inválidas' })
            }

            const passwordValid = await comparePasswords(senhaFornecida, user.senha)

            if (!passwordValid) {
                return reply.status(401).send({ message: 'Credenciais inválidas' })
            }

            return reply.status(200).send({ message: 'Login bem-sucedido', userId: user.id_usuario })

        } catch (error) {
            return reply.status(500).send({ message: 'Erro ao realizar login' })
        }
    })
}