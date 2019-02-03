#!/bin/sh

if [[ -z "$HEAP_SIZE" ]]; then
   echo "Setting default heap size based on docker's memory limit"
   export HEAP_SIZE=$(cat /sys/fs/cgroup/memory/memory.limit_in_bytes)
   echo 'HEAP_SIZE = '$HEAP_SIZE
else
   echo 'HEAP_SIZE = '$HEAP_SIZE
fi

export GARBAGE_COLLECTION_LIMIT=$(($HEAP_SIZE*3/4))
echo 'GARBAGE_COLLECTION_LIMIT = '$GARBAGE_COLLECTION_LIMIT

exec node --max-old-space-size=$GARBAGE_COLLECTION_LIMIT app/app.js