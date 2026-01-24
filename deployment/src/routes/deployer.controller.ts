import { Hono } from "hono";
import { createNewDeployment } from "../controllers/deploy.controller";

const deployRouter = new Hono();

deployRouter.post("/new", createNewDeployment);

export default deployRouter;
