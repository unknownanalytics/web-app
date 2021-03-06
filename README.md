![logo](./app/assets/ico/favicon-32x32.png)

[unknownanalytics](https://www.unknownanalytics.com/) is a minimalist analytics tool that protect user privacy.

This is the code source of the web application including the web sdk.

# App architecture

![architecture](docs/assets/full-arch.png)

## Local dev requirement

* Version
    - ruby-2.7.2
    - Rails 6.1.3
    - pg 10
    - redis

## Postgres

* Install libq-dev (native lib tool for pg). For alpine image we use `postgresql-dev` instead .

### Bundle installation

`bundle install`

### Database 

* Create your database (develop only), please follow [deployment instruction](docs/deployment.md) for docker compose
  deployment

* Database initialization (migrations and so on)

run `UNK_ANA_DATABASE_URI=<postgres://postgres_user:pg_password@host/your_db_name> UNK_ANA_REDIS_URI=<redis://host> (bundle exec) db migrate`

* Generate migration

run `UNK_ANA_DATABASE_URI=<postgres://postgres_user:pg_password@host/your_db_name> UNK_ANA_REDIS_URI=<redis://host> (bundle exec) rails g migration <add_new_attr>`


### Local development

Run server (dev only). See [.env](.env) for full vars env list

The minimum required env are `UNK_ANA_DATABASE_URI`, `UNK_ANA_REDIS_URI`, `UNK_ANA_SMTP_URI`

`UNK_ANA_DATABASE_URI=<postgres://postgres_user:pg_password@host/db_name> UNK_ANA_REDIS_URI=<redis://host> UNK_ANA_SMTP_URI=<your_smtp_local> rails s`

### For deployment process, see [deployment](docs/deployment.md)

### SDK JS

The sdk is build with rollup, inside [web-sdk-cli](./web-sdk-cli/src)

* Use `npm run watch` to live reload compile
* Use `npm run build` to build the sdk. This is step is done automatically when docker-compose is mounted.
* Use [index.html](web-sdk-cli/test/index.html) file to test the sdk.
* Use `unkAnalytics('api_key', {debug : true });` for debugging

### Services

* TODO
  (job queues, cache servers, search engines, etc.)
