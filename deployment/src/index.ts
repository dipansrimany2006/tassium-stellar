import { Hono } from "hono";
import router from "./routes";
import { startRebalancer } from "./services/rebalancer.service";

const app = new Hono();

startRebalancer();

app.route("/api/v1", router);

export default app;
