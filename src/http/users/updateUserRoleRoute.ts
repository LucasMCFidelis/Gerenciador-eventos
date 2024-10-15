import { FastifyInstance } from "fastify";
import { verifyRole } from "../../utils/security/verifyRole.js";
import { getUserById } from "../../utils/db/getUserById.js";
import { prisma } from "../../utils/db/prisma.js";
import { handleError } from "../../utils/handlers/handleError.js";

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
    
            // Verificar permissão do usuário
            const {adminId, newRole} = request.body
            const verifyRoleResponse = await verifyRole({userId: adminId, requiredRole: "Admin"})
            if (!verifyRoleResponse.hasPermission || verifyRoleResponse.error) {
                return reply.status(verifyRoleResponse.status).send({ message : verifyRoleResponse.message })
            } 
     
            // Verifica se o usuário existe
            const userResponse = await getUserById(userId)
            if (!userResponse.data || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
            }
    
            const updatedUser = await prisma.user.update({
                where: {userId},
                data: {roleId: (newRole === "Admin" ? 1 : 2)}
            })
    
            return reply.status(200).send({
                message: `Permissão do usuário ${updatedUser.firstName} atualizada com sucesso para ${newRole}`,
            })
        } catch (error){
            console.error(error)
            handleError(error, reply)
        }
    })
}