#!/bin/bash

set -e  

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Tassium Worker Node Setup ===${NC}"

# Step 1: Install Docker
echo -e "${YELLOW}Installing Docker...${NC}"
sudo apt update
sudo apt install docker.io
newgrp docker
sudo usermod -aG docker $USER

# Step 2: Install Tailscale
echo -e "${YELLOW}Installing Tailscale...${NC}"
curl -fsSL https://tailscale.com/install.sh | sh

# Step 3: Authenticate Tailscale with authkey
# Get authkey from: https://login.tailscale.com/admin/settings/keys
if [ -z "$TAILSCALE_AUTHKEY" ]; then
  echo -e "${YELLOW}Error: TAILSCALE_AUTHKEY is required${NC}"
  exit 1
fi
echo -e "${YELLOW}Authenticating Tailscale with authkey...${NC}"
sudo tailscale up --authkey=$TAILSCALE_AUTHKEY # secret

# Step 4: Configure insecure registry
echo -e "${YELLOW}Configuring Docker registry...${NC}"
REGISTRY_IP="${REGISTRY_IP:-100.75.8.67}"

sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json > /dev/null <<EOF
{
  "insecure-registries": ["${REGISTRY_IP}:5000"]
}
EOF

# Step 5: Restart Docker
echo -e "${YELLOW}Restarting Docker...${NC}"
sudo systemctl restart docker

# Step 6: Join Swarm
if [ -z "$SWARM_TOKEN" ]; then
  echo -e "${YELLOW}No SWARM_TOKEN provided. Skipping swarm join.${NC}"
  echo -e "${YELLOW}Run manually: docker swarm join --token <token> ${REGISTRY_IP}:2377${NC}"
else
  echo -e "${YELLOW}Joining Docker Swarm...${NC}"
  docker swarm join --token $SWARM_TOKEN ${REGISTRY_IP}:2377 # secret
fi

echo -e "${GREEN}=== Setup Complete ===${NC}"
echo -e "${YELLOW}Note: You may need to log out and back in for docker group to take effect.${NC}"
