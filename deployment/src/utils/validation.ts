const APP_NAME_REGEX = /^[a-z][a-z0-9-]*$/;
const MAX_APP_NAME_LENGTH = 20;

export function validateAppName(name: string): { valid: boolean; error?: string } {
  if (!name) {
    return { valid: false, error: "App name is required" };
  }
  if (name.length > MAX_APP_NAME_LENGTH) {
    return { valid: false, error: `App name must be ${MAX_APP_NAME_LENGTH} chars or less` };
  }
  if (!APP_NAME_REGEX.test(name)) {
    return { valid: false, error: "App name must start with letter, lowercase alphanumeric and hyphens only" };
  }
  if (name.includes("--")) {
    return { valid: false, error: "App name cannot have consecutive hyphens" };
  }
  return { valid: true };
}

export function validateGithubRepo(repo: string): { valid: boolean; error?: string } {
  if (!repo) {
    return { valid: false, error: "GitHub repo is required" };
  }
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    return { valid: false, error: "Invalid GitHub repo format (use: username/repo)" };
  }
  return { valid: true };
}
