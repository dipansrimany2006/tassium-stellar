import { NextResponse, NextRequest } from "next/server";

const API_URL =
  process.env.TASSIUM_API_URL || "https://api.tassium.roydevelops.tech";
const SETUP_URL =
  process.env.SETUP_URL || "https://worker.tassium.roydevelops.tech";

function generateSetupScript(walletAddress: string) {
  return `#!/bin/bash

set -e

GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
NC='\\033[0m'
WALLET_ADDRESS='${walletAddress}'
API_URL='${API_URL}'
SETUP_URL='${SETUP_URL}'

echo -e "\${GREEN}=== Tassium Worker Node Setup ===\${NC}"

# Step 1: Install Docker
echo -e "\${YELLOW}Installing Docker...\${NC}"
sudo apt update
sudo apt install -y docker.io jq
sudo usermod -aG docker $USER

# Step 2: Install Tailscale
echo -e "\${YELLOW}Installing Tailscale...\${NC}"
curl -fsSL https://tailscale.com/install.sh | sh

# Step 3: Provision credentials from server
echo -e "\${YELLOW}Provisioning credentials...\${NC}"
PROVISION_RESPONSE=$(curl -s -w "\\n%{http_code}" -X POST "\${SETUP_URL}/api/provision" \\
  -H "Content-Type: application/json" \\
  -d "{\\"walletAddress\\": \\"\${WALLET_ADDRESS}\\"}")

HTTP_CODE=$(echo "$PROVISION_RESPONSE" | tail -n1)
PROVISION_BODY=$(echo "$PROVISION_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" != "200" ]; then
  echo -e "\${RED}Error: Failed to provision credentials (HTTP $HTTP_CODE)\${NC}"
  echo "$PROVISION_BODY"
  exit 1
fi

TAILSCALE_AUTHKEY=$(echo "$PROVISION_BODY" | jq -r '.tailscaleAuthKey')
SWARM_TOKEN=$(echo "$PROVISION_BODY" | jq -r '.swarmToken')
REGISTRY_IP=$(echo "$PROVISION_BODY" | jq -r '.registryIp')

if [ -z "$TAILSCALE_AUTHKEY" ] || [ "$TAILSCALE_AUTHKEY" = "null" ]; then
  echo -e "\${RED}Error: Failed to get Tailscale auth key\${NC}"
  exit 1
fi

# Step 4: Authenticate Tailscale with authkey
echo -e "\${YELLOW}Authenticating Tailscale with authkey...\${NC}"
sudo tailscale up --authkey="\${TAILSCALE_AUTHKEY}"

# Step 5: Configure insecure registry
echo -e "\${YELLOW}Configuring Docker registry...\${NC}"

sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "insecure-registries": ["\${REGISTRY_IP}:5000"]
}
EOF

# Step 6: Restart Docker
echo -e "\${YELLOW}Restarting Docker...\${NC}"
sudo systemctl restart docker

# Step 7: Join Swarm
if [ -z "$SWARM_TOKEN" ] || [ "$SWARM_TOKEN" = "null" ]; then
  echo -e "\${YELLOW}No SWARM_TOKEN received. Skipping swarm join.\${NC}"
  echo -e "\${YELLOW}Run manually: docker swarm join --token <token> \${REGISTRY_IP}:2377\${NC}"
else
  echo -e "\${YELLOW}Joining Docker Swarm...\${NC}"
  sudo docker swarm join --token $SWARM_TOKEN \${REGISTRY_IP}:2377
fi

# Step 8: Setup heartbeat service
echo -e "\${YELLOW}Setting up heartbeat service...\${NC}"

sudo tee /usr/local/bin/tassium-heartbeat.sh > /dev/null << 'SCRIPT'
#!/bin/bash
WALLET_ADDRESS="$1"
API_URL="$2"
TICK=0

while true; do
  TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

  # Every 30s: lightweight ping
  curl -s -X POST "$API_URL/api/v1/heartbeat/ping" \
    -H "Content-Type: application/json" \
    -d "{\\"walletAddress\\": \\"$WALLET_ADDRESS\\", \\"timestamp\\": \\"$TIMESTAMP\\"}" > /dev/null 2>&1

  # Every 10th tick (300s): full heartbeat with system + container metrics
  if [ $((TICK % 10)) -eq 0 ]; then
    TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "")
    HOSTNAME_VAL=$(hostname)

    # System metrics
    CPU_CORES=$(nproc)
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)
    [ -z "$CPU_USAGE" ] && CPU_USAGE=0

    RAM_INFO=$(free -m | awk '/Mem:/ {printf "%d %d", $2, $3}')
    RAM_TOTAL_MB=$(echo "$RAM_INFO" | awk '{print $1}')
    RAM_USED_MB=$(echo "$RAM_INFO" | awk '{print $2}')
    RAM_TOTAL_GB=$(echo "scale=2; $RAM_TOTAL_MB / 1024" | bc)
    RAM_USED_GB=$(echo "scale=2; $RAM_USED_MB / 1024" | bc)

    STORAGE_INFO=$(df -BG / | awk 'NR==2 {gsub("G",""); printf "%d %d", $2, $3}')
    STORAGE_TOTAL_GB=$(echo "$STORAGE_INFO" | awk '{print $1}')
    STORAGE_USED_GB=$(echo "$STORAGE_INFO" | awk '{print $2}')

    # Container metrics via docker stats
    CONTAINERS=$(docker stats --no-stream --format '{{.Name}}|{{.CPUPerc}}|{{.MemUsage}}' 2>/dev/null | \
      jq -R -s -c 'split("\\n") | map(select(length > 0)) | map(split("|") | {
        name: .[0],
        cpuPercent: ((.[1] // "0%") | gsub("%";"") | tonumber),
        memUsageMb: ((.[2] // "0MiB") | split("/")[0] | gsub("[^0-9.]";"") | tonumber)
      })')
    [ -z "$CONTAINERS" ] && CONTAINERS="[]"

    PAYLOAD=$(jq -n \
      --arg wallet "$WALLET_ADDRESS" \
      --arg ts "$TIMESTAMP" \
      --arg ip "$TAILSCALE_IP" \
      --arg hn "$HOSTNAME_VAL" \
      --argjson cores "$CPU_CORES" \
      --argjson cpuUsage "$CPU_USAGE" \
      --argjson ramTotal "$RAM_TOTAL_GB" \
      --argjson ramUsed "$RAM_USED_GB" \
      --argjson storTotal "$STORAGE_TOTAL_GB" \
      --argjson storUsed "$STORAGE_USED_GB" \
      --argjson containers "$CONTAINERS" \
      '{
        walletAddress: $wallet,
        timestamp: $ts,
        tailscaleIp: $ip,
        hostname: $hn,
        containers: $containers,
        system: {
          cpuCores: $cores,
          cpuUsagePercent: $cpuUsage,
          ramTotalGb: $ramTotal,
          ramUsedGb: $ramUsed,
          storageTotalGb: $storTotal,
          storageUsedGb: $storUsed
        }
      }')

    curl -s -X POST "$API_URL/api/v1/heartbeat" \
      -H "Content-Type: application/json" \
      -d "$PAYLOAD" > /dev/null 2>&1
  fi

  TICK=$((TICK + 1))
  sleep 30
done
SCRIPT

sudo chmod +x /usr/local/bin/tassium-heartbeat.sh

sudo tee /etc/systemd/system/tassium-heartbeat.service > /dev/null <<EOF
[Unit]
Description=Tassium Worker Heartbeat
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
ExecStart=/usr/local/bin/tassium-heartbeat.sh \${WALLET_ADDRESS} \${API_URL}
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable tassium-heartbeat
sudo systemctl start tassium-heartbeat

echo -e "\${GREEN}=== Setup Complete ===\${NC}"
echo -e "\${YELLOW}Note: You may need to log out and back in for docker group to take effect.\${NC}"
echo -e "\${YELLOW}Heartbeat service is running. Check status: systemctl status tassium-heartbeat\${NC}"
`;
}

export async function GET(request: NextRequest) {
  if (!SETUP_URL) {
    return new NextResponse("Missing env var: SETUP_URL", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }

  const wallet = request.nextUrl.searchParams.get("wallet");

  if (!wallet) {
    return new NextResponse(
      "Missing wallet query parameter. Usage: /api/setup?wallet=YOUR_WALLET_ADDRESS",
      {
        status: 400,
        headers: { "Content-Type": "text/plain" },
      },
    );
  }

  return new NextResponse(generateSetupScript(wallet), {
    headers: { "Content-Type": "text/plain" },
  });
}
