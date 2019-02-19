#!/bin/bash -e

echo Loading system-tests env variables

export HTTP_POOL_SIZE=100
export PREDATOR_URL=http://127.0.0.1:80/v1

if [[ "$LOCAL_TEST" == true ]]; then
    echo "Running local test"
    tests/system-tests/dockerRun.sh predator
fi

echo Loaded successfully!