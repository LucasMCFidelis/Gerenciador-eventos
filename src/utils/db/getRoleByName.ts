import { prisma } from "./prisma.js";

import { GetResponse } from "../../interfaces/getResponseInterface.js";
import { Role } from "../../interfaces/roleInterface.js";

interface GetRoleResponse extends GetResponse {
  data?: Role;
}

export enum UserRole {
  Admin = "Admin",
  User = "User",
}

export async function getRoleByName(
  roleName: UserRole
): Promise<GetRoleResponse> {
  try {
    // Validação do newRole usando o enum
    if (!Object.values(UserRole).includes(roleName)) {
      return {
        status: 400,
        message: "Papel inválido. Somente 'Admin' ou 'User' são aceitos.",
        error: "Erro de validação",
      };
    }

    // Busca pelo nome da role
    const role = await prisma.role.findUnique({
      where: { roleName },
    });

    // Verifica de a Role foi encontrada
    if (!role) {
      return {
        status: 404,
        message: "Role não encontrada",
        error: "Erro Not Found",
      };
    }

    // Monta objeto de acordo com a interface Role
    const roleData: Role = {
      roleId: role.roleId,
      roleName: role.roleName,
      roleDescription: role.roleDescription,
    };

    // Sucesso, então retorna o objeto roleData
    return {
      status: 200,
      data: roleData,
      error: false,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Erro ao buscar a role",
      error: "Erro no servidor",
    };
  }
}
