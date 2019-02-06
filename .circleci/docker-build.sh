#!/usr/bin/sh

set -eu -o pipefail

if [ -z ${CIRCLE_TAG:-""} ] ; then
    exit 0
fi

if [ $CIRCLE_BRANCH != "master" ] ; then
    exit 0
fi

echo "Building Docker image for tag $CIRCLE_TAG on $CIRCLE_BRANCH"

docker build -t nivlipetz/predator-runner:$CIRCLE_TAG .

echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin

docker push nivlipetz/predator-runner:$CIRCLE_TAG
