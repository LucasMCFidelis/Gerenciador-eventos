export function ValidateRoleName(roleName: string): boolean {
  if (roleName !== "Admin" && roleName !== "User") {
    return false;
  }

  return true;
}
