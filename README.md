
#IIGB AWS Helpers

## About this application

This application is written using the [Node.js](https://nodejs.org/en/) JavaScript runtime. 

This utility application can drop, populate, and refresh indexed data held in [AWS Cloudsearch](https://aws.amazon.com/cloudsearch/).

## The purpose

The purpose of this repository is to provide the AWS interface for the IIGB website repository to allow for easy deployment of the site.

The 'release.sh' script is called by the website during the websites release and deploy process, to manage the release versioning and the upload of the sites files to the S3 bucket.
