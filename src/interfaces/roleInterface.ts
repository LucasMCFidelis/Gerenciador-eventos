import { UserRole } from "../types/userRoleType.js";

export interface Role {
    roleId: number;
    roleName: UserRole;
    roleDescription: string | null;
}
