import { Hono } from "hono";
import healthRouter from "./health.route";
import deployRouter from "./deployer.controller";
import githubRouter from "./github.route";
import appsRouter from "./apps.controller";

const router = new Hono();

router.route("/health", healthRouter);
router.route("/deploy", deployRouter);
router.route("/github", githubRouter);
router.route("/apps", appsRouter);

export default router;
