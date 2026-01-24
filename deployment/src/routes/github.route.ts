import { Hono } from "hono";
import { checkDockerfile } from "../controllers/github.controller";

const githubRouter = new Hono();

githubRouter.post("/check-dockerfile", checkDockerfile);

export default githubRouter;
