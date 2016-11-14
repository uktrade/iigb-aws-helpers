#!/bin/bash
##########################################
#Invalidateds Cloudfront cache for dtistributions with ids defined as a comma separated list with $DID variable"
#########################################


[ -z "$DID" ] && \
echo "[ERROR] DID variable must be specified as a comma separated distribution id list for caches to be invalidated" && \
exit 1

#AWS CLI support for this service is only available in a preview stage.
aws configure set preview.cloudfront true


result=0
IFS=',' read -ra IDS  <<< "$DID"
for i in "${IDS[@]}"; do
     echo "Invalidating cache for distribution id $i"
     aws cloudfront create-invalidation --distribution-id $i --paths /
     if [ $? -ne 0 ]; then
         echo "Invalidationg cache for id $i failed" >&2
         result=1
     fi
done

if [ $result -ne 0 ]; then
     echo "Some ditrubtion cache could not be verified" >&2 && exit 1;
fi
