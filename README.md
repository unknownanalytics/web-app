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

## Deployment instructions on docker & docker compose

### Database volume

**You should keep the data in folder using volumes, so we create `/var/unk-data` and inside we create `pg` folder for pg and `redis` folder for redis**

### Assets folder 

##### Create the assets folder
create `/var/www/unk-ana-assets` folder, we will use it later to serve assets 

### Configure nginx

See ngnix folder to copy configuration files.

### Container images & docker compose

Note, that for building image we only need the minimum of env variables.

##### Run docker compose

```
UNK_ANA_PG_USER=postgres 
UNK_ANA_PG_PASSWORD=root \ 
UNK_ANA_PG_DATA=/var/unk-data-pg \ 
UNK_ANA_PG_DB=track-web_development \ 
UNK_ANA_DATABASE_URI=postgres://postgres:root@localhost/track-web_development \ 
UNK_ANA_STRIPE_API_KEY=<your_stripe_key> \ 
UNK_ANA_APP_HOST=<your_host_key> \ 
UNK_ANA_SMTP_URI=<your_smtp_key>  \ 
UNK_ANA_SMTP_AUTH_METHOD=<your_smtp_auth_method> \
UNK_ANA_SCREENSHOT_SECRET_KEY=secret_12345_change_me \
UNK_ANA_REDIS_CHANNEL_PREFIX=unk \
UNK_ANA_SIDEKIQ_USER=GOTO \ 
UNK_ANA_SIDEKIQ_PASSWORD=GOTO \ 
UNK_ANA_WickedPdf_EXEC_PATH="C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe" \ 
docker-compose --env-file ./.env up
```

#### Copy assets to nginx,

Once the container is up and running, you should copy the latest generated assets from docker. In production/staging
mode, rails does not serve static files (unless you enable it). It's always suitable to serve it using nginx or any
other dedicated server.

So if we will serve static file from /var/www/unk-ana-assets_staging/assets, we will copy assets from `/var/www/unk-web-app` (see Dockerfile)

`docker cp <id_container|container_name>:/var/www/unk-web-app/public/assets /var/www/<path_to_your_assets>`

Replace the `<id_container|container_name>` by the container id or the container name 
For this configuration you can use 

`sudo rm -rf /var/www/unk-ana-assets/assets && \
sudo mkdir -p /var/www/unk-ana-assets && \
sudo docker cp unk-web-app:/var/www/unk-web-app/public/assets /var/www/unk-ana-assets/assets`

* Docker on windows.

There are some issues related to database volume on windows (permission denied). I try to setup but i ended installing
ubuntu with wsl2 to avoid the issue. You can use direct address of docker on window is `host.docker.internal` for redis
and postgres 
