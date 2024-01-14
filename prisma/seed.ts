import { PrismaClient } from "@prisma/client";
import { hash } from '@node-rs/bcrypt'

const prisma = new PrismaClient();

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "123456";


async function main() {
  //超级管理员
  const commonUserInfo = {
    username: ADMIN_USERNAME,
    password: await hash(ADMIN_PASSWORD, 12),
    email: "upwardsrwr@gmail.com",
    nickName: "Upwards",
    avatarUrl: "",
    country: "China",
    province: "",
    city: "",
    biography: "The author of polaris Admin",
    enabled: true,
  };

  await prisma.user.create({
    data: {
      ...commonUserInfo,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

