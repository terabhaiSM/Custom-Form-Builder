const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

async function main() {
  const forms = await prisma.form.findMany(); // Fetch all existing forms

  for (const form of forms) {
    // Assign a unique UUID to each form
    await prisma.form.update({
      where: { id: form.id },
      data: { uuid: uuidv4() },
    });
  }

  console.log("UUIDs populated for all forms!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });