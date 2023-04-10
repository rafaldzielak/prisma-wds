import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
  // const user = await prisma.user.create({ data: { name: "Dyrek" } });
  const user = await prisma.user.findMany();
  console.log(user);
};

main()
  .catch((e) => console.error(e.message))
  .finally(async () => await prisma.$disconnect());
