#!/bin/sh

docker build -t zscott/pan-web .
docker tag -f zscott/pan-web gcr.io/strong-pursuit-722/pan-web
gcloud docker push gcr.io/strong-pursuit-722/pan-web
