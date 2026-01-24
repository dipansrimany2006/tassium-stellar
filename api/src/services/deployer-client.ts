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
  const res = await fetch(`${deployerUrl}/api/v1/deploy/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    return { success: false, message: "Deployer request failed", error: text };
  }

  return res.json();
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
