#!/bin/sh

alias fleetcluster="fleetctl --strict-host-key-checking=false --tunnel=$PAN_IP"

fleetcluster stop pan-web@1.service
fleetcluster destroy pan-web@1.service
fleetcluster stop pan-web@2.service
fleetcluster destroy pan-web@2.service
fleetcluster stop pan-web@3.service
fleetcluster destroy pan-web@3.service
