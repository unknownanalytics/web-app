This is the web app module for [unknownanalytics](unknownanalytics.com/)
Simple analytics to protect user privacy and get only essentials metrics.

# Global architecture

![Kiku](docs/assets/full-arch.png)

# Web app module  (current repo)

![Kiku](docs/assets/web-app-arch-module.png)

## Local dev requirement

* Ruby version

    - ruby-2.7.2
    - Rails 6.0.2
    - pg

* Install libq-dev (native lib tool for pg). For alpine image we use `postgresql-dev` instead .

* Configuration

  `bundle install`

* Database creation

Create your database

* Database initialization

run `(bundle exec ) db migrate`

* Services (job queues, cache servers, search engines, etc.)

> TODO

### set up env variables

Below the list of env variables that should be set in order to run the app, all these variables are listed in `.env`
file.

`UNK_ANA_DATABASE_URI=postgres://<user>:<pass>@<host>/<db_name>` // Postgres db uri

`UNK_ANA_APP_NAME=<App name>` // will be displayed in title and emails

`UNK_ANA_DEFAULT_PAGE_TITLE=<your browser app title>` // will be displayed in title and emails

`UNK_ANA_STRIPE_API_KEY=<stripe_key>`  // This is not mandatory, you can keep it empty for now as payment is not
configured.

`UNK_ANA_APP_HOST=<your_app_host>` // your host

`UNK_ANA_REDIS_URI=redis://<host>:<port>` // Redis uri

`UNK_ANA_REDIS_CHANNEL_PREFIX=<channel_prefix>` // Redis channel prefix. This is useful because when we use the same
redis db for multiples purposes, we need to separate app channels from other channels.

`UNK_ANA_SMTP_URI=smtp://<user>:<pass>@<host>` // SMTP uri

`UNK_ANA_SMTP_AUTH_METHOD=<smtp_method>` // cram_md5 or plain ..

`UNK_ANA_SCREENSHOT_SECRET_KEY=<your_secret>` // secret_12345_change_me

