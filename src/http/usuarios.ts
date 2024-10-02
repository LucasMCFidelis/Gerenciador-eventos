import bcrypt from "bcrypt"
import { schemaCadastre } from "../schemas/schemaCadastre.js"
import { schemaUserPassword } from "../schemas/schemaUserPassword.js"
import { handleError } from "../utils/handleError.js"
import { FastifyInstance, FastifyReply } from "fastify"
import { prisma } from "../utils/prisma.js"
import { checkExistingUser } from "../utils/checkExistingUser.js"
import { getUserById } from "../utils/getUserById.js"
import { getUserByEmail } from "../utils/getUserByEmail.js"
import { hashPassword } from "../utils/hashPassword.js"

interface Cadastro {
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string | null
    password: string
}

interface UserAutentication {
    userId: string
    email: string
    password: string
}

async function comparePasswords(passwordProvided: string, passwordHash: string) {
    return await bcrypt.compare(passwordProvided, passwordHash)
}

async function updateUserPassword(userId: string, newPassword: string, reply: FastifyReply) {
    const newPasswordHash = await hashPassword(newPassword)
    await prisma.user.update({
        where: {
            userId
        },
        data: {
            password: newPasswordHash
        }
    }).then(() => {
        return reply.status(200).send({ message: 'Senha atualizada com sucesso' })
    }).catch((error) => {
        console.error(error)
        return reply.status(500).send({ message: 'Erro ao atualizar senha' })
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
            await schemaCadastre.validateAsync({
                firstName,
                lastName,
                email,
                phoneNumber
            })
            await schemaUserPassword.validateAsync({
                password
            })
            const senhaHash = await hashPassword(password)
            
            const {status, existingUser, message} = await checkExistingUser(email)           
            if (existingUser) {
                return reply.status(status).send({message})
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

            const userDataValidate = await schemaCadastre.validateAsync(request.body)
            const { firstName, lastName, email, phoneNumber } = userDataValidate
            
            const {status, existingUser, message} = await checkExistingUser(email)           
            if (existingUser) {
                return reply.status(status).send({message})
            }

            await prisma.user.update({
                where: {
                    userId: user.userId
                },
                data: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber
                }
            }).then(() => {
                return reply.status(200).send({ message: 'Usuário atualizado com sucesso' })
            })
        } catch (error) {
            return handleError(error, reply)
        }
    })

    fastify.delete('/usuarios/id/:id', async (request, reply) => {
        try {
            const userId = (request.params as { id: string }).id
            const user = await getUserById(userId)
            if (!user) {
                return reply.status(404).send({ message: 'Usuário não encontrado' })
            }

            await prisma.user.delete({
                where: {
                    userId
                }
            }).then(() => {
                reply.status(204).send()
            })
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

            await schemaUserPassword.validateAsync({ novaSenha })
            await updateUserPassword(user.userId, novaSenha, reply)
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

            const passwordValid = await comparePasswords(senhaFornecida, user.password)

            if (!passwordValid) {
                return reply.status(401).send({ message: 'Credenciais inválidas' })
            }

            return reply.status(200).send({ message: 'Login bem-sucedido', userId: user.userId })

        } catch (error) {
            return reply.status(500).send({ message: 'Erro ao realizar login' })
        }
    })
}