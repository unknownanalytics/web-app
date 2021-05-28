## Deployment instructions on docker & docker compose

### Database volume

**You should keep the data in folder using volumes, so we create `/var/unk-data` and inside we create `pg` folder for pg and `redis` folder for redis**

### Configure nginx

###### See [nginx](../nginx/) folder to copy configuration files.


### Container images & docker compose

Note that for building image we only need the minimum of env variables. Some values are build in env file itself , example `UNK_ANA_DATABASE_URI`

### Docker compose

###### see full variable names in [.env](../.env) file  
```
UNK_ANA_PG_USER=<db_user> 
UNK_ANA_PG_PASSWORD=<db_password> \ 
UNK_ANA_PG_DATA=<postgres_data_folder> \ 
UNK_ANA_PG_DB=<db_name> \ 
UNK_ANA_REDIS_DATA=<redis_data_foler> \ 
UNK_ANA_STRIPE_API_KEY=<your_stripe_key> \ 
UNK_ANA_APP_HOST=<your_host_key> \ 
UNK_ANA_SMTP_URI=<your_smtp_key>  \ 
UNK_ANA_SMTP_AUTH_METHOD=<your_smtp_auth_method> \
UNK_ANA_SCREENSHOT_SECRET_KEY=<secret_12345_change_me> \
UNK_ANA_REDIS_CHANNEL_PREFIX=<unk> \
UNK_ANA_SIDEKIQ_USER=<GOTO> \ 
UNK_ANA_SIDEKIQ_PASSWORD=<GOTO> \ 
UNK_ANA_WickedPdf_EXEC_PATH="C:\Program Files\wkhtmltopdf\bin\wkhtmltopdf.exe" \ !!! not this is for windows, remove it for ubuntu 
docker-compose --env-file ./.env up --build
```
* add `up -d --build` to run with deamon


### Assets folder

##### Create the assets folder

create `/var/www/unk_ana-assets` folder, we will use it later to serve assets
See [nginx file](../nginx/production), all assets are served by nginx.
#### Copy assets to nginx,

Once the container is up and running, you should copy the latest generated assets from docker. In production/staging
mode, rails does not serve static files (unless you enable it). It's always suitable to serve it using nginx or any
other dedicated server.

So if we will serve static file from `/var/www/unk_ana-assets/assets`, we will copy assets docker assets to `/var/www/unk-web-app` (see [nginx file](../Dockerfile) and [entrypoint](../docker/entrypoint.sh))

`rm -rf /var/www/unk_ana-assets/`

`docker cp <id_container|container_name>:/var/www/unk-web-app/public/assets /var/www/unk_ana-assets/`

Replace the `<id_container|container_name>` by the container id or the container name
For this configuration you can use

`sudo rm -rf /var/www/unk_ana-assets/assets && \
sudo mkdir -p /var/www/unk_ana-assets && \
sudo docker cp unk-web-app:/var/www/unk-web-app/public/assets /var/www/unk_ana-assets/assets`

### SDK JS 

The sdk js is built with rollup, see the `build` script in the [scripts list](../package.json), this will build the `sdk.js` and put it inside `assets` along with all other assets files.
It should be copied to assets host directory and served by nginx.


###  Docker on windows.


There are some issues related to database volume on windows (permission denied). I try to setup but i ended installing
ubuntu with wsl2 to avoid the issue. You can use direct address of docker on window is `host.docker.internal` for redis
and postgres 
