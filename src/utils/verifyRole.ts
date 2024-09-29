import { getUserById } from "./getUserById.js"

interface verifyRoleProps {
    userId: string
    requiredRole: string
}

export async function verifyRole({ userId, requiredRole }: verifyRoleProps): Promise<boolean> {
    const user = await getUserById(userId)
    return user ? user.role?.roleName === requiredRole : false
}