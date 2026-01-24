import { Hono } from "hono";
import healthRouter from "./health.route";
import deployRouter from "./deployer.controller";
import githubRouter from "./github.route";

const router = new Hono();

router.route("/health", healthRouter);
router.route("/deploy", deployRouter);
router.route("/github", githubRouter);

export default router;
