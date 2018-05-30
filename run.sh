#!/bin/bash
set -e

CONFIG_PATH=/data/options.json
CONNECTION_STRING="$(jq --raw-output '.connectionString' $CONFIG_PATH)"
WATCH="$(jq --raw-output '.watch' $CONFIG_PATH)"

echo Hello!
node -v
npm -v
gulp -v
gulp watch-files --storageConnectionString="$CONNECTION_STRING" --watch="$WATCH"