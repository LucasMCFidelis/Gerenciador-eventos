import {
  prisma
} from "../../chunk-KRHBA2SY.js";
import "../../chunk-JSBRDJBE.js";

// src/utils/db/seed.ts
async function seedRoles() {
  await prisma.role.createMany({
    data: [
      { roleName: "Admin", roleDescription: "Acesso total ao sistema" },
      { roleName: "User", roleDescription: "Pode visualizar e se inscrever em eventos" }
    ]
  });
  console.log("Pap\xE9is criados com sucesso!");
}
async function seedAdmins() {
  await prisma.user.createMany({
    data: [
      {
        firstName: "John",
        lastName: "Doe acme",
        email: "john.doe@example.com",
        phoneNumber: "5551234567",
        password: "@J0hnD03#",
        roleId: 1
      },
      {
        firstName: "Carlos",
        lastName: "Pedro Ara\xFAjo",
        email: "carlos@example.com",
        phoneNumber: "5588874567",
        password: "@JMKIoowD03#",
        roleId: 1
      }
    ]
  });
}
async function main() {
  await seedRoles();
  await seedAdmins();
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
