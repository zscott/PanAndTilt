#!/bin/sh

alias fleetcluster="fleetctl --strict-host-key-checking=false --tunnel=$PAN_IP"

fleetcluster start pan-web@1.service
fleetcluster start pan-web@2.service
fleetcluster start pan-web@3.service
