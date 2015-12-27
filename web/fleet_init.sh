#!/bin/sh

export PAN_IP="$(gcloud compute instances list pan-node1 --format text | awk '/natIP/ {print $2}')"

echo 'alias fleetcluster="fleetctl --strict-host-key-checking=false --tunnel=$PAN_IP"'
echo "fleetcluster list-machines"
