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
RUN bundle install --jobs 20 --retry 5
# Adding project files
COPY . .

ENV DOCKER 1
ARG DATABASE_URL


#RUN bundle exec rake RAILS_ENV=production  assets:precompile
RUN bundle exec rake db:migrate

EXPOSE 3000

CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]