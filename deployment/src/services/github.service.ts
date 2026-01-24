import { parseGithubUrl } from "../utils/github-url";

export interface DockerfileCheckResult {
  exists: boolean;
  url: string;
  branch: string;
}

export class GithubApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "GithubApiError";
  }
}

export async function checkDockerfileExists(
  githubUrl: string,
): Promise<DockerfileCheckResult> {
  const parsed = parseGithubUrl(githubUrl);
  if (!parsed) {
    throw new GithubApiError("Invalid GitHub URL", 400);
  }

  const { owner, repo, branch } = parsed;
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/Dockerfile?ref=${branch}`;

  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "stellar-deploy",
    },
  });

  if (response.status === 404) {
    return { exists: false, url: githubUrl, branch };
  }

  if (!response.ok) {
    throw new GithubApiError(
      `GitHub API error: ${response.statusText}`,
      response.status,
    );
  }

  return { exists: true, url: githubUrl, branch };
}
