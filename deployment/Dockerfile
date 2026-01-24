FROM oven/bun:1-slim

RUN apt-get update && apt-get install -y git docker.io curl && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /usr/lib/docker/cli-plugins && \
    curl -SL https://github.com/docker/buildx/releases/download/v0.14.0/buildx-v0.14.0.linux-amd64 -o /usr/lib/docker/cli-plugins/docker-buildx && \
    chmod +x /usr/lib/docker/cli-plugins/docker-buildx

WORKDIR /app
COPY package.json bun.lockb* ./
RUN bun install

COPY . .

EXPOSE 3000
CMD ["bun", "run", "start"]
