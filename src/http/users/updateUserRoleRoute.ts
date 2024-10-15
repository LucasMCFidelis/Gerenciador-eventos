import { FastifyInstance } from "fastify";
import { verifyRole } from "../../utils/security/verifyRole.js";
import { getUserById } from "../../utils/db/getUserById.js";
import { prisma } from "../../utils/db/prisma.js";
import { handleError } from "../../utils/handlers/handleError.js";

enum UserRole {
    Admin = "Admin",
    User = "User"
}

export async function updateUserRoleRoute(fastify: FastifyInstance) {
    fastify.put<{
        Params: { id: string },
        Body: {
            adminId: string,
            newRole: string
        }
    }>('/usuarios/:id/permissao', async (request, reply) => {
        try {
            const userId = request.params.id
            const {adminId, newRole} = request.body
    
            // Validação do newRole usando o enum
            if (!(newRole in UserRole)) {
                return reply.status(400).send({ message: "Papel inválido. Somente 'Admin' ou 'User' são aceitos." })
            }

            // Verificar permissão do usuário
            const verifyRoleResponse = await verifyRole({userId: adminId, requiredRole: "Admin"})
            if (!verifyRoleResponse.hasPermission || verifyRoleResponse.error) {
                return reply.status(verifyRoleResponse.status).send({ message : verifyRoleResponse.message })
            } 
     
            // Verifica se o usuário existe
            const userResponse = await getUserById(userId)
            const user = userResponse.data
            if (!user || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
            }

            if (user.role?.roleName === newRole){
                return reply.status(400).send({ message: `O usuário ${user.firstName} já possui a permissão ${newRole}`})
            }
    
            const updatedUser = await prisma.user.update({
                where: {userId},
                data: {roleId: (newRole === UserRole.Admin ? 1 : 2)}
            })
    
            return reply.status(200).send({
                message: `Permissão do usuário ${updatedUser.firstName} atualizada com sucesso para ${newRole}`
            })
        } catch (error){
            console.error(error)
            handleError(error, reply)
        }
    })
}