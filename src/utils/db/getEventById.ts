import { Event } from "../../interfaces/eventInterface.js"
import { prisma } from "./prisma.js"

interface GetEventResponse {
    status: number
    data?: Event
    message?: string
    error?: boolean
}

export async function getEventById(eventId: string): Promise<GetEventResponse> {
    try {
        const event = await prisma.event.findUnique({
            where: {
                eventId
            }
        })

        if (!event) {
            return {
                status: 404,
                message: 'Evento não encontrado',
                error: true
            }
        }
        
        return {
            status: 200,
            data: {
                eventId,
                title: event.title,
                description: event.description,
                linkEvent: event.linkEvent,
                address: {
                    street: event.street,
                    number: event.number,
                    neighborhood: event.neighborhood,
                    complement: event.complement,
                },
                startDateTime: event.startDateTime,
                endDateTime: event.endDateTime
            },
            error: false
        }
    } catch (error) {
        console.error(error)
        return {
            status: 500,
            message: 'Erro ao consultar o evento',
            error: true
        }
    }
}