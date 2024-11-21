import {
  prisma
} from "./chunk-KRHBA2SY.js";

// src/utils/db/getRoleByName.ts
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["Admin"] = "Admin";
  UserRole2["User"] = "User";
  return UserRole2;
})(UserRole || {});
async function getRoleByName(roleName) {
  try {
    if (!Object.values(UserRole).includes(roleName)) {
      return {
        status: 400,
        message: "Papel inv\xE1lido. Somente 'Admin' ou 'User' s\xE3o aceitos.",
        error: "Erro de valida\xE7\xE3o"
      };
    }
    const role = await prisma.role.findUnique({
      where: { roleName }
    });
    if (!role) {
      return {
        status: 404,
        message: "Role n\xE3o encontrada",
        error: "Erro Not Found"
      };
    }
    const roleData = {
      roleId: role.roleId,
      roleName: role.roleName,
      roleDescription: role.roleDescription
    };
    return {
      status: 200,
      data: roleData,
      error: false
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: "Erro ao buscar a role",
      error: "Erro no servidor"
    };
  }
}

export {
  UserRole,
  getRoleByName
};
