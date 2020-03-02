# Getting startred 

ruby-2.3.3
Rails 5.2.3

*** SET env vars : 

UNK_ANA_DATABASE_URI=postgres://postgres:root@localhost/track-web_development


# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...


### Deployment instructions 

##### 1- Install postgres

##### 2- PULL version from `git@gitlab.com:unknown-inc/web-app.git`

##### 3- Configure nginx 

##### 4- build docker image
`docker build --build-arg UNK_ANA_DATABASE_URI=<database_uri> --build-arg RAILS_ENV=<environement> -t unk-rails-app .`

##### 4- run the docker image (create container)
```
docker run \
-p 3003:3000 \
--env UNK_ANA_REDIS_URI=redis://host.docker.internal  \
--env UNK_ANA_DATABASE_URI=postgres://postgres:root@host.docker.internal/unk_ana_staging \
--env UNK_ANA_APP_NAME=Unk an \
--env UNK_ANA_STRIPE_API_KEY=TODO \
--env UNK_ANA_APP_HOST=localhost:3002 \
--env UNK_ANA_DEFAULT_PAGE_TITLE=Unk analytics \
--env UNK_ANA_REDIS_CHANNEL_PREFIX=staging \
--env RAILS_ENV=staging \
unk-rails-backend-staging:latest 
```

```

