-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('USERNAME', 'PHONE_NUMBER', 'EMAIL', 'GITHUB', 'GOOGLE', 'WECHAT', 'ALIPAY');

-- CreateTable
CREATE TABLE "system_user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "nick_name" VARCHAR(50),
    "password" VARCHAR(100),
    "email" VARCHAR(50),
    "phone_number" VARCHAR(25),
    "avatar_url" VARCHAR(100),
    "gender" VARCHAR(100),
    "biography" VARCHAR(500),
    "country" VARCHAR(25),
    "province" VARCHAR(25),
    "city" VARCHAR(25),
    "address" VARCHAR(25),
    "website" VARCHAR(50),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "birth_date" DATE,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_auth" (
    "id" SERIAL NOT NULL,
    "auth_type" "AuthType" NOT NULL,
    "open_id" VARCHAR(50) NOT NULL,
    "access_token" VARCHAR(255),
    "refresh_token" VARCHAR(255),
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGithub" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "login" VARCHAR(50) NOT NULL,
    "node_id" VARCHAR(50) NOT NULL,
    "avatar_url" VARCHAR(50) NOT NULL,
    "gravatar_id" VARCHAR(50) NOT NULL,
    "url" VARCHAR(50) NOT NULL,
    "html_url" VARCHAR(50) NOT NULL,
    "followers_url" VARCHAR(50) NOT NULL,
    "following_url" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "site_admin" VARCHAR(50) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "company" VARCHAR(50) NOT NULL,
    "blog" VARCHAR(50) NOT NULL,
    "location" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "hireable" BOOLEAN NOT NULL DEFAULT true,
    "bio" VARCHAR(50) NOT NULL,
    "twitter_username" VARCHAR(50) NOT NULL,
    "public_repos" VARCHAR(50) NOT NULL,
    "public_gists" VARCHAR(50) NOT NULL,
    "followers" INTEGER NOT NULL DEFAULT 0,
    "following" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserGithub_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_login_log" (
    "id" SERIAL NOT NULL,
    "userName" VARCHAR(50) NOT NULL,
    "ip" VARCHAR(50) NOT NULL,
    "address" VARCHAR(50) NOT NULL,
    "browser" VARCHAR(50) NOT NULL,
    "os" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_login_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(500),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_user_role" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_Permission" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "description" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_role_permission" (
    "id" SERIAL NOT NULL,
    "permission_id" INTEGER NOT NULL,
    "role_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_department" (
    "id" SERIAL NOT NULL,
    "leader" VARCHAR(50),
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(50),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "parent_Ids" INTEGER[],
    "parent_id" INTEGER,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dictionary" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(500),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_dictionary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_dictionary_item" (
    "id" SERIAL NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "remark" VARCHAR(500),
    "enable" BOOLEAN NOT NULL DEFAULT true,
    "sort" INTEGER NOT NULL DEFAULT 0,
    "dictionary_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMPTZ(3),
    "updated_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(3),
    "deleted_by" INTEGER,

    CONSTRAINT "system_dictionary_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_user_username_key" ON "system_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "system_user_email_key" ON "system_user"("email");

-- CreateIndex
CREATE INDEX "system_user_username_idx" ON "system_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "system_auth_auth_type_open_id_key" ON "system_auth"("auth_type", "open_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserGithub_id_key" ON "UserGithub"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserGithub_user_id_key" ON "UserGithub"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserGithub_login_key" ON "UserGithub"("login");

-- CreateIndex
CREATE UNIQUE INDEX "system_role_code_key" ON "system_role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "system_dictionary_code_key" ON "system_dictionary"("code");

-- AddForeignKey
ALTER TABLE "system_auth" ADD CONSTRAINT "system_auth_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGithub" ADD CONSTRAINT "UserGithub_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_role" ADD CONSTRAINT "system_user_role_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "system_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_user_role" ADD CONSTRAINT "system_user_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_permission" ADD CONSTRAINT "system_role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "system_Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_role_permission" ADD CONSTRAINT "system_role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "system_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_department" ADD CONSTRAINT "system_department_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "system_department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_dictionary_item" ADD CONSTRAINT "system_dictionary_item_dictionary_id_fkey" FOREIGN KEY ("dictionary_id") REFERENCES "system_dictionary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
