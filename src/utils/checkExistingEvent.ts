import { FastifyReply } from "fastify"
import { prisma } from "./prisma.js"

interface checkExistingEventResponse {
    status: number
    eventExisting: boolean
    message?: string
}

export async function checkExistingEvent(eventId: string): Promise<checkExistingEventResponse> {
    try {
        const event = await prisma.event.findUnique({
            select: {
                eventId: true
            },
            where: {
                eventId
            }
        })

        if (!event) {
            return {
                status: 404,
                eventExisting: false,
                message: 'Evento não encontrado'
            }
        }

        return {
            status: 200,
            eventExisting: true
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            eventExisting: false,
            message: 'Erro ao consultar o evento'
        }
    }
}