import { FastifyReply } from "fastify"
import { prisma } from "./prisma.js"

export async function getEventById(eventId: string, reply: FastifyReply) {
    await prisma.event.findUnique({
        where: {
            eventId
        }
    }).then((event) => {
        if (!event) {
            return reply.status(404).send({ message: 'Evento não encontrado' })
        }
        return reply.status(200).send(event)
    }).catch((error) => {
        console.error(error)
        return reply.status(500).send({ message: 'Erro ao consultar o evento' })
    })
}