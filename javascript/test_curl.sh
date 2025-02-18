#!/bin/bash

# Get the IP address of eduardosanzb.dev and set up iptables rules
EDUARDOSANZB_IP=$(dig +short eduardosanzb.dev | head -n 1)
echo "Eduardo's IP: $EDUARDOSANZB_IP"

# Set up iptables rules
iptables -A OUTPUT -d "$EDUARDOSANZB_IP" -p tcp --dport 443 -j ACCEPT
iptables -A OUTPUT -p tcp --dport 443 -j DROP

# Curl to the allowed domain
echo "Curling to https://eduardosanzb.dev"
curl -sSf https://eduardosanzb.dev>/dev/null  && echo "Success!"

# Curl to the blocked domain
echo "Curling to https://google.com (should fail)"
curl -m 10 --connect-timeout 5 -sSf https://google.com && echo "Success!" || echo "Failed as expected!"

echo "finish"
