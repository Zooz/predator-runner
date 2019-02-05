#!/usr/bin/env bash

echo Loading system-tests env variables

export CONCURRENCY_LIMIT=500
export HTTP_POOL_SIZE=100
export RUN_ID=system-tester

if [[ $(uname) = "Darwin" ]];then
    export DCOS_URL=dcos
    export LOCAL_TEST=true
else
    export DCOS_URL=dcos-internal
    export LOCAL_TEST=false
fi

export PREDATOR_URL=http://predator.performance-framework.$DCOS_URL.qa-fra-apps.zooz.co

echo Loaded successfully!