#! /bin/bash

echo "Deploying..."

function verify {
    [ -z "$BUCKET" ] && echo "No S3 bucket specified for deployment, please set BUCKET" && exit 1


    if [ -z "$REGION" ]; then
      echo "AWS region not set, using eu-west-1" && REGION="eu-west-1"
    else
      echo "S3 region set as $REGION"
    fi

    if [ -z "$BUILD_FOLDER" ]; then
      echo "Build folder is not set, using ./build" && BUILD_FOLDER="build"
    else
      echo "Build folder is $BUILD_FOLDER"
    fi
}


function deploy {
    echo "Deploying build to S3 bucket $BUCKET"

    #directory of this script

    if [ "$NO_ROBOTS" = "true" ]; then
        dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
        echo "No robots flag set for this deployment, deploying no robots configuration"
        cp "$dir"/norobots.txt "$PWD"/"$BUILD_FOLDER"/robots.txt
    fi

        aws s3 sync "$PWD"/"${BUILD_FOLDER}/assets" s3://"${BUCKET}/assets" --region="$REGION" --delete --storage-class REDUCED_REDUNDANCY --cache-control="max-age=604800"

    if [ "$NO_CACHE" = "true" ]; then
        echo "Deploying index files with 0(zero) cache"
        aws s3 sync "$PWD"/"$BUILD_FOLDER" s3://"$BUCKET" --region="$REGION" --delete --storage-class REDUCED_REDUNDANCY
    else
        echo "Deploying index files with 5 mins cache"

        aws s3 sync "$PWD"/"$BUILD_FOLDER" s3://"$BUCKET" --exclude 'assets/*' --region="$REGION" --delete --storage-class REDUCED_REDUNDANCY --cache-control="max-age=300"
    fi

    #Clean no robots text file
    if [ "$NO_ROBOTS" = "true" ]; then
        rm "$PWD"/"$BUILD_FOLDER"/robots.txt
    fi
}

verify && deploy
