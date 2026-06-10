FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY scripts ./scripts
COPY tsconfig.json ./
COPY src ./src

ARG DATABASE_URL=mysql://placeholder:placeholder@localhost:3306/placeholder
ENV DATABASE_URL=${DATABASE_URL}

RUN npm run prisma:validate
RUN npm run typecheck
RUN npm run prisma:generate
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npx prisma db seed && npm run start"]
