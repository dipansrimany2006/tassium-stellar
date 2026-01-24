# Check systemd service status

systemctl status tassium-heartbeat

# View logs

journalctl -u tassium-heartbeat -f

# Check if process running

ps aux | grep tassium-heartbeat
