#!/bin/sh

CMD="gcloud compute instances delete pan-node1 pan-node2 pan-node 3 --quiet"
echo $CMD
eval $CMD
