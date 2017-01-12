#!/bin/bash

#Exit on error
set -oe pipefail

if [[ -n $(git status --porcelain) ]]; then
    echo "Repo is dirty" && \
    echo "Please stash or commit your changes before running rollback" && \
    exit 1;
fi

function switch_to() {
    echo "Switching to $1"
    git checkout --quiet $1
}

function update() {
    switch_to $1
    echo "Pulling latest $1"
    git pull --rebase --quiet
}

# current Git branch
branch=$(git rev-parse --abbrev-ref HEAD)

# version to roll back to
version=$1
[ -z $1 ] && echo "Please speficy version to roll back to" && exit 1

# establish branch and tag name variables
stableBranch="stable"

#Fetch remote trackers for releasing
echo "Fetching remote branches (git fetch)"
git fetch --quiet

echo "Updating $stableBranch branch to point $version"
switch_to $stableBranch
git reset --hard "refs/tags/$version"
git push --force origin stable # Update stable tag

#switch back to branch you started
switch_to $branch
