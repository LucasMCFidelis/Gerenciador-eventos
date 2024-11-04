import { Role } from "@prisma/client"

export interface UserTokenInterfaceProps {
    userId: string
    email: string
    role: Role
}