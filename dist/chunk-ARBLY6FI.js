import {
  getRoleByName
} from "./chunk-H34GZ3OM.js";
import {
  checkRole
} from "./chunk-WAXIKHJ4.js";
import {
  getUserById
} from "./chunk-HVJ57BPC.js";
import {
  handleError
} from "./chunk-ZOAOPETN.js";
import {
  prisma
} from "./chunk-KRHBA2SY.js";

// src/http/users/updateUserRoleRoute.ts
async function updateUserRoleRoute(fastify) {
  fastify.put("/usuarios/:id/permissao", {
    onRequest: [fastify.authenticate, await checkRole("Admin")]
  }, async (request, reply) => {
    try {
      const userId = request.params.id;
      const { newRole } = request.body;
      const roleResponse = await getRoleByName(newRole);
      if (!roleResponse.data || roleResponse.error) {
        return reply.status(roleResponse.status).send({
          error: roleResponse.error,
          message: roleResponse.message
        });
      }
      const userResponse = await getUserById(userId);
      const user = userResponse.data;
      if (!user || userResponse.error) {
        return reply.status(userResponse.status).send({
          error: userResponse.error,
          message: userResponse.message
        });
      }
      if (user.role?.roleName === newRole) {
        const errorValue = "Erro de Conflito";
        return reply.status(409).send({
          error: errorValue,
          message: `O usu\xE1rio ${user.firstName} j\xE1 possui a permiss\xE3o ${newRole}`
        });
      }
      const updatedUser = await prisma.user.update({
        where: { userId },
        data: { roleId: roleResponse.data.roleId }
      });
      return reply.status(200).send({
        message: `Permiss\xE3o do usu\xE1rio atualizada com sucesso, ${updatedUser.firstName} agora \xE9 ${newRole}`
      });
    } catch (error) {
      handleError(error, reply);
    }
  });
}

export {
  updateUserRoleRoute
};
