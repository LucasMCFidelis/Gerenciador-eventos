import { FastifyInstance } from "fastify";
import { prisma } from "../../utils/db/prisma.js"

export async function listEventRoute(fastify: FastifyInstance) {
    fastify.get('/eventos', async (request, reply) => {
        await prisma.event.findMany({
            orderBy: {
                title: "asc"
            }
        }).then((events) => {
            if (events.length > 0) {
                return reply.status(200).send(events)
            } else {
                return reply.status(404).send({ message: 'Nenhum evento encontrado' })
            }
        }).catch((error) => {
            console.error(error.message)
            return reply.status(500).send({ message: 'Erro na consulta ao banco de dados' })
        })
    })
}