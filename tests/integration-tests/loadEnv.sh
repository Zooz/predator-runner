#!/usr/bin/env bash

echo Loading integration-tests env variables
export RUN_ID=integration-tester

if [[ $(uname) = "Darwin" ]];then
    export DCOS_URL=dcos
else
    export DCOS_URL=dcos-internal
fi

export TESTS_API_URL=http://api.performance-framework.$DCOS_URL.qa-fra-apps.zooz.co
export REPORTER_URL=http://reporter.performance-framework.$DCOS_URL.qa-fra-apps.zooz.co

echo Loaded successfully!