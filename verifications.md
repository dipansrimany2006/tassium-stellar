## Check systemd service status

systemctl status tassium-heartbeat

## View logs

journalctl -u tassium-heartbeat -f

## Check if process running

ps aux | grep tassium-heartbeat

# CURL

curl -s "https://YOUR_WORKER_CLIENT_DOMAIN/api/setup?wallet=YOUR_WALLET_ADDRESS" | sh
