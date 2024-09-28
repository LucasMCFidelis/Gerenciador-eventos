import { prisma } from "../src/utils/prisma.js"

async function seedRoles() {
  await prisma.role.createMany({
    data: [
      { roleName: 'Admin', roleDescription: 'Acesso total ao sistema' },
      { roleName: 'User', roleDescription: 'Pode visualizar e se inscrever em eventos' },
    ],
  })
  console.log('Papéis criados com sucesso!')
}

async function main() {
  await seedRoles()
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })