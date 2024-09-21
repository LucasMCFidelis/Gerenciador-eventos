import { db } from "../createDatabase.js"
import bcrypt from "bcrypt"
import { schemaCadastro } from "../schemas/schemaCadastro.js"
import { schemaSenhaUsuario } from "../schemas/schemaSenhaUsuario.js"
import { handleError } from "../utils/handleError.js"
import { FastifyInstance } from "fastify"
import { prisma } from "../utils/prisma.js"

interface Usuario {
    userId: string
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string | null
}

interface Cadastro {
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string | null
    password: string
}

interface UserAutentication {
    id_usuario: string
    email: string
    senha: string
}

async function getUserById(userId: string): Promise<Usuario | null> {
    if (!userId) {
        console.error("Invalid userId")
        return null
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                userId
            },
            select: {
                userId: true,
                firstName: true,
                lastName: true,
                email: true,
                phoneNumber: true
            }
        })
        return user
    } catch (error) {
        console.error("Error fetching user:", error)
        return null
    }
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
            const { firstName, lastName, email, phoneNumber, password } = request.body as Cadastro
            await schemaCadastro.validateAsync({
                nome: firstName,
                sobrenome: lastName,
                email,
                telefone: phoneNumber
            })
            await schemaSenhaUsuario.validateAsync({
                senha: password
            })
            const senhaHash = await hashPassword(password)

            const existingUser = await prisma.user.findUnique({
                where: {
                    email
                },
                select: {
                    email: true
                }
            })
            console.log(existingUser)

            if (existingUser) {
                return reply.status(400).send({ message: 'Este email já está cadastrado' })
            }

            await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    password: senhaHash
                }
            }).then((usuario) => {
                return reply.status(200).send({
                    userId: usuario.userId,
                    firstName: usuario.firstName,
                    lastName: usuario.lastName,
                    email: usuario.email,
                    phoneNumber: usuario.phoneNumber,
                })
            }).catch((error) => {
                console.error(error)
                return reply.status(500).send({ message: 'Erro ao salvar cadastro' })
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