#!/usr/bin/env bash

echo Loading system-tests env variables

export HTTP_POOL_SIZE=100
export RUN_ID=system-tester-$(date +%s)
export PREDATOR_URL=http://predator.performance-framework.dcos-internal.mars-fra-apps.zooz.co

if [[ $(uname) = "Darwin" ]];then
    export LOCAL_TEST=true
else
    export LOCAL_TEST=false
fi

echo Loaded successfully!