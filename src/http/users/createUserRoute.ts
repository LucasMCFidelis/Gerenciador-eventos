import { FastifyInstance } from "fastify";
import { schemaCadastre } from "../../schemas/schemaCadastre.js";
import { schemaUserPassword } from "../../schemas/schemaUserPassword.js";
import { checkExistingUser } from "../../utils/checkExistingUser.js";
import { handleError } from "../../utils/handleError.js";
import { prisma } from "../../utils/prisma.js";
import { hashPassword } from "../../utils/hashPassword.js";

interface Cadastro {
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string | null
    password: string
}

export async function createUserRoute(fastify:FastifyInstance) {
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

}