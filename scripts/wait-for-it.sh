#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available.
#   Inspired by https://github.com/vishnubob/wait-for-it and licensed under the MIT License.
#
# Usage:
#   ./wait-for-it.sh host:port [-t timeout] [-- command args...]
#
# Examples:
#   ./wait-for-it.sh localhost:5432 -t 15 -- echo "Postgres is up"
#
WAITFORIT_cmdname=$(basename "$0")

echoerr() {
    if [ "$QUIET" -ne 1 ]; then echo "$@" 1>&2; fi
}

usage() {
    cat <<USAGE >&2
Usage:
  $WAITFORIT_cmdname host:port [-t timeout] [-- command args...]
Examples:
  $WAITFORIT_cmdname localhost:5432 -t 15 -- echo "Postgres is up"
USAGE
    exit 1
}

TIMEOUT=15
QUIET=0

# Process command line options.
while getopts ":t:q" opt; do
    case "$opt" in
    t)
        TIMEOUT=$OPTARG
        ;;
    q)
        QUIET=1
        ;;
    *)
        usage
        ;;
    esac
done
shift $((OPTIND - 1))

if [ $# -lt 1 ]; then
    usage
fi

HOSTPORT=$1
shift

HOST=$(echo "$HOSTPORT" | cut -d: -f1)
PORT=$(echo "$HOSTPORT" | cut -d: -f2)

if [ -z "$HOST" ] || [ -z "$PORT" ]; then
    echoerr "Error: you must provide a host and port in the format host:port"
    usage
fi

echoerr "Waiting for $HOST:$PORT for up to $TIMEOUT seconds..."

start_ts=$(date +%s)
end_ts=$((start_ts + TIMEOUT))
while :; do
    if nc -z "$HOST" "$PORT" >/dev/null 2>&1; then
        break
    fi
    now_ts=$(date +%s)
    if [ $now_ts -ge $end_ts ]; then
        echoerr "Operation timed out after waiting $TIMEOUT seconds for $HOST:$PORT"
        exit 1
    fi
    sleep 1
done

echoerr "$HOST:$PORT is available after $(($(date +%s) - start_ts)) seconds"

if [ "$#" -gt 0 ]; then
    exec "$@"
fi
