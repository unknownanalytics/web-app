#!/bin/sh
# https://stackoverflow.com/a/38732187/1935918
set -e
echo $CWD

if [ -f /unk-app/tmp/pids/server.pid ]; then
  rm /unk-app/tmp/pids/server.pid
fi

### migrate db
bundle exec rake db:migrate 2>/dev/null || bundle exec rake db:setup

### generate assets
bundle exec rake assets:precompile

### Build sdk js and put it inside public/assets
bundle exec rake assets:sdk

exec bundle exec "$@"