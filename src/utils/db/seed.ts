import { hashPassword } from "../security/hashPassword.js"
import { prisma } from "./prisma.js"

async function seedRoles() {
  const existingRoles = await prisma.role.findFirst()
  if (existingRoles) {
    console.log('Roles já foram criados.')
    return
  }
  
  await prisma.role.createMany({
    data: [
      { roleName: 'Admin', roleDescription: 'Acesso total ao sistema' },
      { roleName: 'User', roleDescription: 'Pode visualizar e se inscrever em eventos' },
    ],
  })
  console.log('Papéis criados com sucesso!')
}

async function seedAdmins() {
  // Verificar se os dados já existem
  const existingUser = await prisma.user.findFirst()
  if (existingUser) {
    console.log('Seed já foi executado.')
    return
  }
  
  await prisma.user.createMany({
    data: [
      {
        firstName: 'John', 
        lastName: 'Doe acme', 
        email: 'john.doe@example.com',
        phoneNumber: '5551234567',
        password: await hashPassword('@J0hnD03#'),
        roleId: 1
      },
      {
        firstName: 'Carlos', 
        lastName: 'Pedro Araújo', 
        email: 'carlos@example.com',
        phoneNumber: '5588874567',
        password: await hashPassword('@JMKIoowD03#'),
        roleId: 1
      }
    ]
  })
  console.log('Admins criados com sucesso!')
}

async function main() {
  await seedRoles()
  await seedAdmins()

  console.log('Seed executado com sucesso.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })