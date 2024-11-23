import { schemaCadastre } from "../../schemas/schemaUserCadastre.js";
import { schemaUserPassword } from "../../schemas/schemaUserPassword.js";
import { hashPassword } from "../security/hashPassword.js";
import { getRoleByName } from "./getRoleByName.js";
import { prisma } from "./prisma.js";

async function seedRoles() {
  const existingRoles = await prisma.role.findFirst();
  if (existingRoles) {
    console.log("Roles já foram criados.");
    return;
  }

  await prisma.role.createMany({
    data: [
      { roleName: "Admin", roleDescription: "Acesso total ao sistema" },
      {
        roleName: "User",
        roleDescription: "Pode visualizar e se inscrever em eventos",
      },
    ],
  });
  console.log("Papéis criados com sucesso!");
}

async function seedAdmins() {
  // Verificar se os dados já existem
  const existingUser = await prisma.user.findFirst();
  if (existingUser) {
    console.log("Seed já foi executado.");
    return;
  }

  const password = process.env.ADMIN_PASSWORD || "Admin33@!e";
  const hashedPassword = await hashPassword(password);

  const admins = [
    {
      firstName: "John",
      lastName: "Doe acme",
      email: "john.doe@example.com",
      phoneNumber: "5551234567",
      password,
    },
    {
      firstName: "Carlos",
      lastName: "Pedro Araújo",
      email: "carlos@example.com",
      phoneNumber: "5588874567",
      password,
    },
  ];

  const roleResponse = await getRoleByName("Admin");

  for (const admin of admins) {
    try {
      // Validação dos dados com schemas
      await schemaCadastre.concat(schemaUserPassword).validateAsync({
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phoneNumber: admin.phoneNumber,
        password: admin.password,
      });

      // Criptografar a senha do usuário

      await prisma.user.create({
        data: {
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          phoneNumber: admin.phoneNumber,
          password: hashedPassword,
          roleId: roleResponse.data?.roleId,
        },
      });
      
      console.log(`${admin.firstName} criado`);
    } catch (error) {
      console.error(error);
    }
  }

  console.log("Admins criados com sucesso!");
}

async function main() {
  await seedRoles();
  await seedAdmins();

  console.log("Seed executado com sucesso.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
