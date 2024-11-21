// src/utils/security/hashPassword.ts
import bcrypt from "bcrypt";
async function hashPassword(password) {
  const saltHounds = 10;
  return await bcrypt.hash(password, saltHounds);
}

export {
  hashPassword
};
