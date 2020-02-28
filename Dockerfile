FROM ruby:2.3.3

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
# Set an environment variable where the Rails app is installed to inside of Docker image
ENV RAILS_ROOT /var/www/unk-web-app

RUN mkdir -p $RAILS_ROOT
# Set working directory
WORKDIR $RAILS_ROOT
# Setting env up

# Adding gems
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
# https://stephencodes.com/upgrading-ruby-dockerfiles-to-use-bundler-2-0-1/
ENV BUNDLER_VERSION 2.0.2
#set the version in Gemfile
# RUN bundle install --jobs 20 --retry 5 --without development test
RUN bundle install --jobs 20 --retry 5 --without development test
# Adding project files
COPY . .

# Set all necessary keys for the db:migrate tasks
ARG RAILS_ENV
ARG UNK_ANA_DEFAULT_PAGE_TITLE
ARG UNK_ANA_REDIS_CHANNEL_PREFIX
ARG UNK_ANA_WEB_NOTIFICATION_CHANNEL
ARG UNK_ANA_SECRET_KEY_BASE
ARG UNK_ANA_APP_NAME
ARG UNK_ANA_APP_HOST
ARG UNK_ANA_REDIS_URI
ARG UNK_ANA_DATABASE_URI
ARG UNK_ANA_STRIPE_API_KEY
ARG UNK_ANA_SMTP_URI
ARG UNK_ANA_SMTP_AUTH_METHOD
ARG UNK_ANA_CABLE_URL
ARG UNK_ANA_SCREENSHOT_SECRET_KEY
# ARG UNK_APP_IS_BILLABLE=false
# Set env
ENV UNK_APP_IS_BILLABLE false


# Set env
ENV DOCKER 1

RUN bundle exec rake db:migrate

RUN bundle exec rake assets:precompile

EXPOSE 3000


CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]