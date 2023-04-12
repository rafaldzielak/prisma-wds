import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(/*{ log: ["query"] }*/);

const createUsers = async () => {
  const user = await prisma.user.create({
    data: {
      name: "Rafa",
      email: "rafa@dyrektorek.com",
      age: 28,
      //nested reference
      userPreference: { create: { emailUpdates: true } },
    },
    // include: {
    //   userPreference: true,
    // },
    //we can do either select or include
    select: {
      name: true,
      userPreference: { select: { id: true } },
    },
  });
  const count = await prisma.user.createMany({
    data: [
      { name: "Rafa2", email: "rafa2@dyrektorek.com", age: 28 },
      { name: "Rafa3", email: "rafa3@dyrektorek.com", age: 28 },
      { name: "Rafa", email: "rafa4@dyrektorek.com", age: 29 },
    ],
  });
  // console.log(user);
  // console.log(count);
};

const advancedFiltering = async () => {
  const userUnique = await prisma.user.findUnique({ where: { age_name: { age: 28, name: "Rafa" } } });
  const user = await prisma.user.findFirst({ where: { name: "Rafa", AND: { age: 28 } } });
  const users = await prisma.user.findMany({
    where: { age: 28 },
    distinct: ["name"],
    take: 2,
    skip: 1,
    orderBy: { name: "desc" },
  });
  const users2 = await prisma.user.findMany({
    where: {
      OR: [{ name: { in: ["Rafa, Rafa2"] } }, { age: { not: 28 } }],
      AND: [{ email: { endsWith: "@dyrektorek.com" } }, { email: { contains: "rafa" } }],
    },
  });
  // console.log(userUnique);
  // console.log(user);
  // console.log(users);
  // console.log(users2);
};

const relationshipFiltering = async () => {
  const users = await prisma.user.findMany({
    where: {
      writtenPosts: {
        some: { title: "Test" },
      },
    },
  });
  const posts = await prisma.post.findMany({
    where: {
      author: { is: { age: 28 } },
    },
  });
  console.log(users);
};

const main = async () => {
  await prisma.user.deleteMany();
  await createUsers();
  await advancedFiltering();
  await relationshipFiltering();
};

main()
  .catch((e) => console.error(e.message))
  .finally(async () => await prisma.$disconnect());
