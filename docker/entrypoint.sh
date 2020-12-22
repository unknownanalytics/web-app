#!/bin/sh
# https://stackoverflow.com/a/38732187/1935918
set -e
echo $CWD

if [ -f /unk-app/tmp/pids/server.pid ]; then
  rm /unk-app/tmp/pids/server.pid
fi

bundle exec rake db:migrate 2>/dev/null || bundle exec rake db:setup

exec bundle exec "$@"