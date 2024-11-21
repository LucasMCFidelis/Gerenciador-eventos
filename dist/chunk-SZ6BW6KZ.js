// src/utils/security/comparePasswords.ts
import bcrypt from "bcrypt";
async function comparePasswords(passwordProvided, passwordHash) {
  return await bcrypt.compare(passwordProvided, passwordHash);
}

export {
  comparePasswords
};
