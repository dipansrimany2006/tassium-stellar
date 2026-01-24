import { Hono } from "hono";
import { Env } from "../types/env";
import deployments from "./deployments";
import heartbeat from "./heartbeat";
import workers from "./workers";

const app = new Hono<{ Bindings: Env }>();

app.route("/deployments", deployments);
app.route("/heartbeat", heartbeat);
app.route("/workers", workers);

export default app;
