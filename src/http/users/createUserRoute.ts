import { FastifyInstance } from "fastify";
import { schemaCadastre } from "../../schemas/schemaUserCadastre.js";
import { schemaUserPassword } from "../../schemas/schemaUserPassword.js";
import { checkExistingUser } from "../../utils/validators/checkExistingUser.js";
import { handleError } from "../../utils/handlers/handleError.js";
import { prisma } from "../../utils/db/prisma.js";
import { hashPassword } from "../../utils/security/hashPassword.js";
import { CadastreUser } from "../../interfaces/cadastreUserInterface.js";

export async function createUserRoute(fastify: FastifyInstance) {
    fastify.post('/usuarios', async (request, reply) => {
        try {
            // Extrair dados fornecidos no corpo da requisição
            const { firstName, lastName, email, phoneNumber, password } = request.body as CadastreUser

            // Validação dos dados com schemas
            await schemaCadastre.concat(schemaUserPassword).validateAsync({
                firstName,
                lastName,
                email,
                phoneNumber,
                password
            })

            // Verificação de usuário existente
            const { status, existingUser, message, error } = await checkExistingUser(email)
            if (existingUser || error) {
                return reply.status(status).send({ message })
            }

            // Criptografar a senha do usuário
            const hashedPassword = await hashPassword(password)

            // Criar o usuário no banco de dados
            const newUser = await prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    phoneNumber,
                    password: hashedPassword
                }
            })

            // Responder com os dados do usuário (sem retornar a senha)
            return reply.status(201).send({
                userId: newUser.userId,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
            })
        } catch (error) {
            // Tratamento de erros genéricos utilizando o handler global
            return handleError(error, reply)
        }
    })

}