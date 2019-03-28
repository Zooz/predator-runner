#!/bin/bash

LOGS_DIRECTORY_PATH=tests/logs
mkdir -p $LOGS_DIRECTORY_PATH

function waitForApp() {
    container=$1
    grepBy=$2
    HEALTH_CHECK_TIMEOUT=40;
    HEALTH_CHECK_INTERVAL=1;
    started=
    while [[ -z $started && $HEALTH_CHECK_TIMEOUT -gt 0 ]]; do
        started=$(docker logs "$container" 2>&1 | grep "$grepBy" 2>/dev/null)
        let HEALTH_CHECK_TIMEOUT=$HEALTH_CHECK_TIMEOUT-1
        sleep $HEALTH_CHECK_INTERVAL
    done

    if [[ -z $started ]];then
        echo "Couldn't start the application on time"
        exit 1
    fi

    docker logs -f "$container" > $LOGS_DIRECTORY_PATH/$APP.log &
}

function predator() {
    IMAGE_NAME=zooz/predator:latest
    APP=predator
    stop $APP
    COMMAND="docker run \
                    -d \
                    -e JOB_PLATFORM=DOCKER \
                    -e INTERNAL_ADDRESS=http://127.0.0.1:80/v1 \
                    -e DATABASE_NAME=predator
                    -e DATABASE_TYPE=SQLITE
                    --name $APP \
                    -p 80:80
                    $IMAGE_NAME"
    echo -e "Starting $APP\n"${COMMAND/\s+/ }
    $COMMAND

    COMMAND_EXIT_CODE=$?
    if [ ${COMMAND_EXIT_CODE} != 0 ]; then
        printf "Error when executing: '${APP}'\n"
        exit ${COMMAND_EXIT_CODE}
    fi

    waitForApp $APP "Predator listening"
    sleep 5
    echo "$APP is ready"
}

function stop() {
    NAME=$1
    isExists=$(docker ps -af name=$NAME | grep -v IMAGE)
    if [ ! -z isExists ];then
        docker rm -f $NAME
    fi
}

if [[ ! $INIT ]];then
    docker login -u gitlab-ci-token -p $CI_BUILD_TOKEN $CI_REGISTRY
    export INIT=true
fi

for option in ${@}; do
    case $option in
    predator)
        predator
        ;;
    stop)
        stop
        ;;
    *)
        echo "Usage: ./dockerRun.sh <predator>"
        ;;
    esac
done