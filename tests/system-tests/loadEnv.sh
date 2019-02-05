#!/usr/bin/env bash

echo Loading system-tests env variables

export CONCURRENCY_LIMIT=500
export HTTP_POOL_SIZE=100
export RUN_ID=system-tester

if [[ $(uname) = "Darwin" ]];then
    export PREDATOR_URL=http://predator.performance-framework.dcos.apps.mars.fra.zooz.internal
    export LOCAL_TEST=true
else
    export PREDATOR_URL=http://predator.performance-framework.dcos-internal.mars-fra-apps.zooz.co
    export LOCAL_TEST=false
fi

echo Loaded successfully!