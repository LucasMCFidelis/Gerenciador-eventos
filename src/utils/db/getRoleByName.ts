import { prisma } from "./prisma.js"

import { GetResponse } from "../../interfaces/getResponseInterface.js"
import { Role } from "../../interfaces/roleInterface.js"

interface GetRoleResponse extends GetResponse{
    data?: Role
}

export enum UserRole {
    Admin = "Admin",
    User = "User"
}

export async function getRoleByName(roleName: UserRole): Promise<GetRoleResponse> {
    try {
        // Validação do newRole usando o enum
        if (!(roleName in UserRole)) {
            return {
                status: 400,
                message: "Papel inválido. Somente 'Admin' ou 'User' são aceitos." ,
                error: true
            }
        }

        const role = await prisma.role.findUnique({
            where: { roleName } // Busca pelo nome da role
        })

        if (!role) {
            return {
                status: 404,
                message: "Role não encontrada",
                error: true
            }
        }

        const roleData: Role = {
            roleId: role.roleId,
            roleName: role.roleName,
            roleDescription: role.roleDescription
        }

        return {
            status: 200,
            data: roleData,
            error: false
        }
    } catch (error) {
        // Tratamento do erro
        if (error instanceof Error) {
            console.error(error.message)
            return {
                status: 500,
                message: `Erro ao buscar a role: ${error.message}`,
                error: true
            }
        } else {
            console.error("Erro desconhecido", error)
            return {
                status: 500,
                message: "Erro desconhecido ao buscar a role",
                error: true
            }
        }
    }
}
