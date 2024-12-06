#!/bin/bash

# run visit
if [[ $# -ge 1 && ( "$1" == "-h" || "$1" == "--help" || "$1" == "help" ) ]]; then
    echo "Usage: ./visit.sh [-l|--ldc|--pt|-p]"
    exit 0
fi

# # do code insertion
python3 cdn-dep-insert.py


if [ $# -ge 1 ];
then
    echo "running: ./visit.js $1"
    ./visit.js $1
else
    echo "running: ./visit.js"
    ./visit.js
fi
