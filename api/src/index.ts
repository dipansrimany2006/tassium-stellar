import { Hono } from "hono";
import { cors } from "hono/cors";
import { Env } from "./types/env";
import routes from "./routes";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

app.get("/", (c) => {
  return c.json({ message: "Tassium API main" });
});

app.route("/api/v1", routes);

export default app;
