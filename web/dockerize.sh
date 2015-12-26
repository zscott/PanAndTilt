#!/bin/sh

docker build -t zscott/pan-and-tilt .
docker tag -f zscott/pan-and-tilt gcr.io/strong-pursuit-722/pan-and-tilt
gcloud docker push gcr.io/strong-pursuit-722/pan-and-tilt
