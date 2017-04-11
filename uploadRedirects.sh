#!/usr/bin/env bash

file="$1"

function verify {
    [ -z "$BUCKET" ] && echo "No S3 bucket specified for deployment, please set BUCKET" && exit 1

    [[ -n $file ]] || { echo "Missing file name"; exit 1; }

    [[ -f $file ]] || { echo "File $file does not exist"; exit 1; }

    if [ -z "$REGION" ]; then
      echo "AWS region not set, using eu-west-1" && REGION="eu-west-1"
    else
      echo "S3 region set as $REGION"
    fi
}


function deploy {
 echo "Deploying redirect rule $file"

 aws s3api put-bucket-website --bucket "$BUCKET" --website-configuration "file://$file"

}

verify && deploy





