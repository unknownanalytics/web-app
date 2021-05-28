This is the web app module for [unknownanalytics](unknownanalytics.com/)
Simple analytics to protect user privacy and get only essentials metrics.

# App architecture

![Kiku](docs/assets/full-arch.png)


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

### Database creation

Create your database (develop only), please follow [deployment instruction](docs/deployment.md) for docker compose deployment

* Database initialization (migration and so on)

run `UNK_ANA_DATABASE_URI=<postgres://postgres_user:pg_password@host/your_db_name> UNK_ANA_REDIS_URI=<redis://host> (bundle exec ) db migrate`

* Run server (dev only). See [.env](.env) for full vars env list 

`UNK_ANA_DATABASE_URI=<postgres://postgres_user:pg_password@host/db_name> UNK_ANA_REDIS_URI=<redis://host> UNK_ANA_SMTP_URI=<your_smtp_local> rails s`


### For deployment process, see [deployment](docs/deployment.md)

### SDK JS 

The sdk is build with rollup, inside [web-sdk-cli](./web-sdk-cli/src)


* Services (job queues, cache servers, search engines, etc.)
