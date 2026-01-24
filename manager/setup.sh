#!/bin/bash

echo "Starting setup"

sudo apt update -y
sudo apt upgrade -y

sudo apt install docker.io
curl -fsSL https://tailscale.com/install.sh | sh


