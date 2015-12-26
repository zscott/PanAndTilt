#!/bin/sh

gcloud compute instances create pantilt1 pantilt2 \
	--image https://www.googleapis.com/compute/v1/projects/coreos-cloud/global/images/coreos-stable-835-9-0-v20151208 \
	--machine-type f1-micro \
	--tags http-server pan-tilt \
	--scopes "https://www.googleapis.com/auth/cloud-platform" \
	--metadata-from-file user-data=cloud-config.yaml
