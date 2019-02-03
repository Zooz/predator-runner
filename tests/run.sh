#!/usr/bin/env bash
if [ -z $BASH_VERSION ];then
    BASH_SOURCE=$0:A
fi

TESTS_ROOT=$(dirname $BASH_SOURCE)

echo Setting up local server
node $TESTS_ROOT/utils/simpleServer.js &
simple_server_pid=$!

if [ -z $1 ];then
    echo "Please pass argument: integration-tests or system-tests"
elif [ "system-tests" == $1 ]; then
    source $TESTS_ROOT/system-tests/loadEnv.sh
    echo Running system tests
    ./node_modules/mocha/bin/mocha $TESTS_ROOT/system-tests --recursive
elif [ "integration-tests" == $1 ]; then
    source $TESTS_ROOT/integration-tests/loadEnv.sh
    echo Running integration tests
    ./node_modules/mocha/bin/mocha $TESTS_ROOT/integration-tests --recursive

else
    echo "Unknown mode $1"
fi

test_status=$?

echo Killing local server
kill $simple_server_pid

exit $test_status