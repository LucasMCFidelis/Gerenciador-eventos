import { prisma } from "../utils/prisma.js"

interface checkExistingUserResponse {
    status: number
    existingUser: boolean
    message?: string
}

export async function checkExistingUser(userEmail: string): Promise<checkExistingUserResponse>{
    const existingUser = await prisma.user.findUnique({
        where: {
            email: userEmail
        },
        select: {
            email: true
        }
    })
    
    if (existingUser) {
        return {
            status: 400,
            existingUser: true,
            message: 'Este email já está cadastrado'
        }
    }
    return {
        status: 200,
        existingUser: false
    }
}
