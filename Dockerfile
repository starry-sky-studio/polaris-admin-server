# 生成器图像
FROM node:20.0-alpine3.14 as build-stage

# 为存储代码的应用程序创建工作目录
WORKDIR /app

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY prisma ./prisma/

RUN apt-get update -y && apt-get install -y openssl

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

FROM node:20.0-alpine3.14 as build-stage

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "npm", "run","prod" ]




# FROM node:18

# WORKDIR /app

# COPY package.json .

# RUN npm config set registry https://registry.npmmirror.com/

# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD [ "node", "./dist/main.js" ]

