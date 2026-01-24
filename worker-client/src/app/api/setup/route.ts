import { NextResponse } from "next/server"

const SETUP_SCRIPT = `#!/bin/bash

set -e

# Colors for output
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color
API_ACCESS_TOKEN='tskey-api-kTPs2fV36r11CNTRL-ppGmgLCwKHLJZqhZemNZHLQyX22m3QpVA'
TAILNET_ID='TZovZknxNP11CNTRL'
SWARM_TOKEN='SWMTKN-1-1c3awgo688ylbmax034ph47rj79qfu6r7x12nclonzuifqvri2-1x0rc0o76037rjnd441lixl1k'

echo -e "\${GREEN}=== Tassium Worker Node Setup ===\${NC}"

# Step 1: Install Docker
echo -e "\${YELLOW}Installing Docker...\${NC}"
sudo apt update
sudo apt install -y docker.io jq
sudo usermod -aG docker $USER

# Step 2: Install Tailscale
echo -e "\${YELLOW}Installing Tailscale...\${NC}"
curl -fsSL https://tailscale.com/install.sh | sh

# Step 3: Create auth key via Tailscale API
if [ -z "$API_ACCESS_TOKEN" ] || [ -z "$TAILNET_ID" ]; then
  echo -e "\${YELLOW}Error: API_ACCESS_TOKEN and TAILNET_ID are required\${NC}"
  exit 1
fi
echo -e "\${YELLOW}Creating Tailscale auth key...\${NC}"
TAILSCALE_AUTHKEY=$(curl -s "https://api.tailscale.com/api/v2/tailnet/\${TAILNET_ID}/keys" \\
  --request POST \\
  --header 'Content-Type: application/json' \\
  --header "Authorization: Bearer \${API_ACCESS_TOKEN}" \\
  --data '{
    "capabilities": {
      "devices": {
        "create": {
          "reusable": false,
          "ephemeral": false,
          "preauthorized": false
        }
      }
    }
  }' | jq -r '.key')

if [ -z "$TAILSCALE_AUTHKEY" ] || [ "$TAILSCALE_AUTHKEY" = "null" ]; then
  echo -e "\${YELLOW}Error: Failed to create auth key\${NC}"
  exit 1
fi

echo -e "\${TAILSCALE_AUTHKEY}"

# Step 4: Authenticate Tailscale with authkey
echo -e "\${YELLOW}Authenticating Tailscale with authkey...\${NC}"
sudo tailscale up --authkey="\${TAILSCALE_AUTHKEY}"
echo 'sudo tailscale up --authkey="\${TAILSCALE_AUTHKEY}"'

# Step 5: Configure insecure registry
echo -e "\${YELLOW}Configuring Docker registry...\${NC}"
REGISTRY_IP="\${REGISTRY_IP:-100.75.8.67}"

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
if [ -z "$SWARM_TOKEN" ]; then
  echo -e "\${YELLOW}No SWARM_TOKEN provided. Skipping swarm join.\${NC}"
  echo -e "\${YELLOW}Run manually: docker swarm join --token <token> \${REGISTRY_IP}:2377\${NC}"
else
  echo -e "\${YELLOW}Joining Docker Swarm...\${NC}"
  docker swarm join --token $SWARM_TOKEN \${REGISTRY_IP}:2377
fi

echo -e "\${GREEN}=== Setup Complete ===\${NC}"
echo -e "\${YELLOW}Note: You may need to log out and back in for docker group to take effect.\${NC}"
`

export async function GET() {
  return new NextResponse(SETUP_SCRIPT, {
    headers: {
      "Content-Type": "text/plain",
    },
  })
}
