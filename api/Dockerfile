FROM oven/bun:1-slim

RUN apt-get update && apt-get install -y git docker.io && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install

COPY . .

EXPOSE 3000
CMD ["bun", "run", "start"]
