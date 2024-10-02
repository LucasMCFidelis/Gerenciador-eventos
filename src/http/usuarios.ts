import { schemaCadastre } from "../schemas/schemaCadastre.js"
import { schemaUserPassword } from "../schemas/schemaUserPassword.js"
import { handleError } from "../utils/handleError.js"
import { FastifyInstance } from "fastify"
import { prisma } from "../utils/prisma.js"
import { checkExistingUser } from "../utils/checkExistingUser.js"
import { getUserById } from "../utils/getUserById.js"
import { getUserByEmail } from "../utils/getUserByEmail.js"
import { comparePasswords } from "../utils/comparePasswords.js"
import { updateUserPassword } from "../utils/updateUserPassword.js"

interface UserAutentication {
    userId: string
    email: string
    password: string
}

export async function usuarios(fastify: FastifyInstance) {
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