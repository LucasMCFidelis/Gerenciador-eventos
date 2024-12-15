import { EventOrganizer } from "@prisma/client"
import { GetResponse } from "../../interfaces/getResponseInterface.js"
import { schemaId } from "../../schemas/schemaId.js"
import { prisma } from "./prisma.js"

interface GetOrganizerResponse extends GetResponse{
    data?: EventOrganizer | null
}

export async function getEventOrganizer(organizerId: string): Promise<GetOrganizerResponse> {
    const { error } = schemaId.validate({ id: organizerId });
    if (error) {
        return {
            status: 400,
            message: error.message ,
            error: "Erro de validação"
        }
    }

    try {
        const organizer = await prisma.eventOrganizer.findUnique({
            where: {
                organizerId
            },
            select: {
                organizerId: true,
                organizerCnpj: true,
                organizerName: true,
                organizerEmail: true,
                organizerPhoneNumber: true,
                createdAt: true,
                events: true
            }
        })

        if (!organizer) {
            return {
                status: 404,
                message: "Organizador de eventos não encontrado",
                error: "Erro Not Found"
            }
        }

        return {
            status: 200,
            data: organizer,
            error: false
        }
    } catch (error) {
        console.error("Erro ao buscar organizador de eventos", error)
        return {
            status: 500,
            message: "Erro interno ao buscar organizador de eventos",
            error: "Erro no servidor"
        }
    }
}