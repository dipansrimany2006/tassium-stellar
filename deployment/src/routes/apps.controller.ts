import { Hono } from "hono";
import {
  appExists,
  removeStack,
  getServiceImage,
  getServiceReplicas,
} from "../services/docker.service";
import { generateStackYaml, writeStackFile } from "../services/stack.service";
import { deployStack } from "../services/docker.service";
import type { BuildContext } from "../types/deploy.types";

const appsRouter = new Hono();

appsRouter.delete("/:name", async (c) => {
  const name = c.req.param("name");

  if (!(await appExists(name))) {
    return c.json({ status: "error", message: "App not found" }, 404);
  }

  try {
    await removeStack(name);
    return c.json({ status: "success", message: `Removed ${name}` });
  } catch (err: any) {
    return c.json({ status: "error", message: err.message }, 500);
  }
});

appsRouter.patch("/:name/env", async (c) => {
  const name = c.req.param("name");
  const { env_vars = {}, port } = await c.req.json();

  if (!(await appExists(name))) {
    return c.json({ status: "error", message: "App not found" }, 404);
  }

  try {
    const imageName = await getServiceImage(name);
    const replicas = await getServiceReplicas(name);

    const ctx: BuildContext = {
      appName: name,
      buildId: "",
      buildDir: "",
      imageName,
      port: port ?? 3000,
      envVars: env_vars,
      replicas,
    };

    const yaml = generateStackYaml(ctx);
    const stackFile = await writeStackFile(name, yaml);
    await deployStack(stackFile, name);

    return c.json({ status: "success", message: `Updated env for ${name}` });
  } catch (err: any) {
    return c.json({ status: "error", message: err.message }, 500);
  }
});

export default appsRouter;
