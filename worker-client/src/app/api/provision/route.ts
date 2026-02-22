import { NextRequest, NextResponse } from "next/server";

const TAILSCALE_API_KEY = process.env.TAILSCALE_API_KEY;
const TAILNET_ID = process.env.TAILNET_ID;
const SWARM_TOKEN = process.env.SWARM_TOKEN;
const REGISTRY_IP = process.env.REGISTRY_IP;

export async function POST(request: NextRequest) {
  const missing = [];
  if (!TAILSCALE_API_KEY) missing.push("TAILSCALE_API_KEY");
  if (!TAILNET_ID) missing.push("TAILNET_ID");
  if (!SWARM_TOKEN) missing.push("SWARM_TOKEN");

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing env vars: ${missing.join(", ")}` },
      { status: 500 },
    );
  }

  let body: { walletAddress?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.walletAddress) {
    return NextResponse.json(
      { error: "Missing walletAddress in request body" },
      { status: 400 },
    );
  }

  // Create one-time Tailscale auth key server-side
  const tsRes = await fetch(
    `https://api.tailscale.com/api/v2/tailnet/${TAILNET_ID}/keys`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TAILSCALE_API_KEY}`,
      },
      body: JSON.stringify({
        capabilities: {
          devices: {
            create: {
              reusable: false,
              ephemeral: false,
              preauthorized: false,
            },
          },
        },
      }),
    },
  );

  if (!tsRes.ok) {
    const text = await tsRes.text();
    console.error("Tailscale API error:", text);
    return NextResponse.json(
      { error: "Failed to create Tailscale auth key" },
      { status: 502 },
    );
  }

  const tsData = await tsRes.json();
  const tailscaleAuthKey = tsData.key;

  if (!tailscaleAuthKey) {
    return NextResponse.json(
      { error: "Tailscale API returned no key" },
      { status: 502 },
    );
  }

  return NextResponse.json({
    tailscaleAuthKey,
    swarmToken: SWARM_TOKEN,
    registryIp: REGISTRY_IP,
  });
}
