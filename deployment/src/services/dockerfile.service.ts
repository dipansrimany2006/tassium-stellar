import { exec } from "../utils/shell";

type ProjectType = "nextjs" | "node" | "python" | "static" | "unknown";

async function detectProjectType(dir: string): Promise<ProjectType> {
  const hasFile = async (file: string) => {
    const r = await exec(`test -f ${dir}/${file} && echo yes`);
    return r.stdout === "yes";
  };

  const hasPackageJson = await hasFile("package.json");
  if (hasPackageJson) {
    const pkgResult = await exec(`cat ${dir}/package.json`);
    if (pkgResult.success) {
      const pkg = JSON.parse(pkgResult.stdout);
      if (pkg.dependencies?.next || pkg.devDependencies?.next) {
        return "nextjs";
      }
    }
    return "node";
  }

  if (await hasFile("requirements.txt") || await hasFile("pyproject.toml")) {
    return "python";
  }

  if (await hasFile("index.html")) {
    return "static";
  }

  return "unknown";
}

const TEMPLATES: Record<ProjectType, string> = {
  nextjs: `FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
`,

  node: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
`,

  python: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
`,

  static: `FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
`,

  unknown: `FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install 2>/dev/null || true
EXPOSE 3000
CMD ["npm", "start"]
`,
};

export async function generateDockerfile(buildDir: string): Promise<void> {
  const projectType = await detectProjectType(buildDir);
  const dockerfile = TEMPLATES[projectType];
  await Bun.write(`${buildDir}/Dockerfile`, dockerfile);
}
