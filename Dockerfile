FROM ruby:2.3.3

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs
# Set an environment variable where the Rails app is installed to inside of Docker image
ENV RAILS_ROOT /var/www/unk-web-app

RUN mkdir -p $RAILS_ROOT
# Set working directory
WORKDIR $RAILS_ROOT
# Setting env up
#ENV RAILS_ENV='production'
#ENV RACK_ENV='production'
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
ARG UNK_ANA_DATABASE_URI
ARG UNK_ANA_SMTP_URI
ARG UNK_ANA_SECRET_KEY_BASE
ARG RAILS_ENV
# Set env
ENV DOCKER 1


RUN bundle exec rake db:migrate

RUN bundle exec rake assets:precompile

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]