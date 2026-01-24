export interface ParsedGithubUrl {
  owner: string;
  repo: string;
  branch: string;
}

export function parseGithubUrl(url: string): ParsedGithubUrl | null {
  const patterns = [
    // https://github.com/owner/repo/tree/branch
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/tree\/(.+)$/,
    // https://github.com/owner/repo
    /^https?:\/\/github\.com\/([^\/]+)\/([^\/]+)\/?$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const repo = match[2].replace(/\.git$/, "");
      return {
        owner: match[1],
        repo,
        branch: match[3] || "main",
      };
    }
  }

  return null;
}
