import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import {
  checkDockerfileExists,
  GithubApiError,
} from "../services/github.service";

interface CheckDockerfileRequest {
  github_url: string;
}

export const checkDockerfile = async (c: Context) => {
  try {
    const body = await c.req.json<CheckDockerfileRequest>();
    const { github_url } = body;

    if (!github_url) {
      return c.json({ error: "github_url is required" }, 400);
    }

    const result = await checkDockerfileExists(github_url);
    return c.json(result);
  } catch (err) {
    if (err instanceof GithubApiError) {
      return c.json({ error: err.message }, err.statusCode as ContentfulStatusCode);
    }
    return c.json({ error: "Internal server error" }, 500);
  }
};
