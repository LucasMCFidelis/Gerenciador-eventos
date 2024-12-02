import { GetResponse } from "../../interfaces/getResponseInterface.js"
import { Role } from "../../interfaces/roleInterface.js"
import { schemaId } from "../../schemas/schemaId.js"
import { prisma } from "./prisma.js"

interface Category {
    categoryId: string
    categoryName: string
    categoryDescription: string | null
    createdAt: Date
}

interface GetCategoryResponse extends GetResponse{
    data?: Category | null
}

export async function getEventCategory(categoryId: string): Promise<GetCategoryResponse> {
    const { error } = schemaId.validate({ id: categoryId });
    if (error) {
        return {
            status: 400,
            message: error.message ,
            error: "Erro de validação"
        }
    }

    try {
        const category = await prisma.eventCategory.findUnique({
            where: {
                categoryId
            },
            select: {
                categoryId: true,
                categoryName: true,
                categoryDescription: true,
                createdAt: true,
            }
        })

        if (!category) {
            return {
                status: 404,
                message: "Categoria de eventos não encontrado",
                error: "Erro Not Found"
            }
        }

        return {
            status: 200,
            data: category,
            error: false
        }
    } catch (error) {
        console.error("Erro ao buscar categoria de eventos", error)
        return {
            status: 500,
            message: "Erro interno ao buscar categoria de eventos",
            error: "Erro no servidor"
        }
    }
}