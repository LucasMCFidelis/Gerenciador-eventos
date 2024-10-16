import { FastifyInstance } from "fastify";
import { verifyRole } from "../../utils/security/verifyRole.js";
import { getUserById } from "../../utils/db/getUserById.js";
import { prisma } from "../../utils/db/prisma.js";
import { handleError } from "../../utils/handlers/handleError.js";
import { getRoleByName, UserRole } from "../../utils/db/getRoleByName.js";

export async function updateUserRoleRoute(fastify: FastifyInstance) {
    fastify.put<{
        Params: { id: string },
        Body: {
            adminId: string,
            newRole: UserRole
        }
    }>('/usuarios/:id/permissao', async (request, reply) => {
        try {
            const userId = request.params.id
            const { adminId, newRole } = request.body

            // Validação do newRole
            const roleResponse = await getRoleByName(newRole)
            if (!roleResponse.data || roleResponse.error) {
                return reply.status(roleResponse.status).send({ message: roleResponse.message })
            }

            // Verificar permissão do usuário
            const verifyRoleResponse = await verifyRole({ userId: adminId, requiredRole: "Admin" })
            if (!verifyRoleResponse.hasPermission || verifyRoleResponse.error) {
                return reply.status(verifyRoleResponse.status).send({ message: verifyRoleResponse.message })
            }

            // Verifica se o usuário existe
            const userResponse = await getUserById(userId)
            const user = userResponse.data
            if (!user || userResponse.error) {
                return reply.status(userResponse.status).send({ message: userResponse.message })
            }

            if (user.role?.roleName === newRole) {
                return reply.status(409).send({ message: `O usuário ${user.firstName} já possui a permissão ${newRole}` })
            }

            const updatedUser = await prisma.user.update({
                where: { userId },
                data: { roleId: roleResponse.data.roleId }
            })

            return reply.status(200).send({
                message: `Permissão do usuário ${updatedUser.firstName} atualizada com sucesso para ${newRole}`
            })
        } catch (error) {
            handleError(error, reply)
        }
    })
}