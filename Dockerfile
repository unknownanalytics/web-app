FROM ruby:2.7.2-alpine

RUN apk update \
    && apk upgrade --no-cache  \
    && apk --update --no-cache add build-base \
    && apk add postgresql-dev  \
    # replace 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
    && apk add tzdata \
    && apk add nodejs \
    && apk add bash \
# standard ruby image
# RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
# clean apk
RUN rm -rf /var/lib/apk/*
# Set an environment variable where the Rails app is installed to inside of Docker image
ENV RAILS_ROOT /var/www/unk-web-app

RUN mkdir -p $RAILS_ROOT
# Set working directory
WORKDIR $RAILS_ROOT
# Setting env up

# Adding gems
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN gem install bundler:2.1.4
# https://stephencodes.com/upgrading-ruby-dockerfiles-to-use-bundler-2-0-1/
ENV BUNDLER_VERSION  2.1.4
#set the version in Gemfile
# RUN bundle install --jobs 20 --retry 5 --without development test

RUN bundle config without 'development test'
RUN bundle install --jobs 20 --retry 5
# Adding project files
COPY . .

# Set env
ENV UNK_APP_IS_BILLABLE=false
# Set env
ENV DOCKER 1

EXPOSE 3000

ENTRYPOINT  ["./docker/entrypoint.sh"]
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]