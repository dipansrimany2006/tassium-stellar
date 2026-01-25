export interface DeployRequest {
  appName: string;
  githubRepo: string;
  branch?: string;
  port?: number;
}

export interface DeployResponse {
  success: boolean;
  message: string;
  url?: string;
  error?: string;
}

export async function callDeployer(
  deployerUrl: string,
  payload: DeployRequest
): Promise<DeployResponse> {
  // deployer expects snake_case
  const body = {
    app_name: payload.appName,
    github_repo: payload.githubRepo,
    branch: payload.branch,
    port: payload.port,
  };

  const url = `${deployerUrl}/api/v1/deploy/new`;
  console.log("[callDeployer] POST", url);
  console.log("[callDeployer] body:", body);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("[callDeployer] response status:", res.status);
    const text = await res.text();
    console.log("[callDeployer] response body:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return { success: false, message: "Invalid JSON response", error: text };
    }

    if (!res.ok || data.status === "error") {
      return { success: false, message: data.message || "Deployer failed", error: data.message };
    }

    return { success: true, message: "Deployed", url: data.url };
  } catch (err: any) {
    console.error("[callDeployer] fetch error:", err.message);
    return { success: false, message: "Network error", error: err.message };
  }
}

export async function deleteDeployment(
  deployerUrl: string,
  appName: string
): Promise<{ success: boolean; error?: string }> {
  const res = await fetch(`${deployerUrl}/api/v1/apps/${appName}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: text };
  }

  return { success: true };
}
