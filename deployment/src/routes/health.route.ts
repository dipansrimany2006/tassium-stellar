import { Hono } from "hono";
import { healthCheck } from "../controllers/health.controller";

const healthRouter = new Hono();

healthRouter.get("/", healthCheck);

export default healthRouter;
