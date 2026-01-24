import { mkdir } from "node:fs/promises";
import type { BuildContext } from "../types/deploy.types";

const DOMAIN = "tassium.roydevelops.tech";
const STACKS_DIR = "/tmp/stacks";

export function generateStackYaml(ctx: BuildContext): string {
  const envLines = Object.entries(ctx.envVars)
    .map(([k, v]) => `      - ${k}=${v}`)
    .join("\n");

  const envSection = envLines ? `    environment:\n${envLines}` : "";

  return `version: "3.8"

services:
  ${ctx.appName}:
    image: ${ctx.imageName}
${envSection}
    networks:
      - traefik-public
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.${ctx.appName}.rule=Host(\`${ctx.appName}.${DOMAIN}\`)"
        - "traefik.http.routers.${ctx.appName}.entrypoints=websecure"
        - "traefik.http.routers.${ctx.appName}.tls.certresolver=letsencrypt"
        - "traefik.http.services.${ctx.appName}.loadbalancer.server.port=${ctx.port}"

networks:
  traefik-public:
    external: true
`;
}
export async function writeStackFile(
  appName: string,
  yaml: string,
): Promise<string> {
  await mkdir(STACKS_DIR, { recursive: true });
  const filePath = `${STACKS_DIR}/${appName}.yml`;
  await Bun.write(filePath, yaml);
  return filePath;
}

export function getAppUrl(appName: string): string {
  return `https://${appName}.${DOMAIN}`;
}
