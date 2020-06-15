


# Getting startred 

ruby-2.6.6
Rails 6.0.2

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
``` 
 docker build \
  -t <you_image_name>  <path/to/web/app/.>  \
  --build-arg UNK_ANA_DATABASE_URI=postgres://<db_user:db_pass@127.0.0.1/db_name> \
  --build-arg RAILS_ENV=production  \
  --build-arg UNK_ANA_SMTP_URI=<smtp://smtp_uri> 
```
##### 4- run the docker image (create container)
```
docker run \
-p 3003:3000 \
--env UNK_ANA_REDIS_URI=redis://127.0.0.1:6379 \
--env UNK_ANA_REDIS_CHANNEL_PREFIX=unknown_analytics_staging \
--env UNK_ANA_DATABASE_URI=postgres://<db_user:db_pass@127.0.0.1/db_name> \
--env UNK_ANA_APP_NAME="Unknown Analytics" \
--env UNK_ANA_STRIPE_API_KEY='<your_stripe_key>' \
--env UNK_ANA_APP_HOST=<your_app.host.com> \
--env UNK_ANA_DEFAULT_PAGE_TITLE="Unknown Analytics" \
--env RAILS_ENV=<your_env> \
--env UNK_ANA_SMTP_URI=<smtp_uri> \
--env UNK_ANA_SMTP_AUTH_METHOD=plain \
--env PORT=3000 \
--env UNK_ANA_CABLE_URL=<youdomain.com/cable/> \
--env UNK_ANA_SECRET_KEY_BASE=<your_secret_key_base> \ 
<you_image_name>:latest 
```

#### Serve assets with nginx 
`docker cp $id_container:/var/www/unk-web-app/public/assets /var/www/unk-ana-assets_staging/assets` 

