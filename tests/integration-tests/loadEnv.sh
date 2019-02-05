#!/usr/bin/env bash

echo Loading integration-tests env variables
export RUN_ID=integration-tester

if [[ $(uname) = "Darwin" ]];then
    export DCOS_URL=dcos
else
    export DCOS_URL=dcos-internal
fi

export PREDATOR_URL=http://predator.performance-framework.$DCOS_URL.qa-fra-apps.zooz.co

echo Loaded successfully!