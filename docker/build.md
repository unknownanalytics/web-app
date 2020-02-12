

## Build docker images 

#### Build backend image staging 
`docker build -t unk-rails-backend-staging /C/users/houssem/perso/track-web/. \
--build-arg RAILS_ENV=staging \
--build-arg UNK_ANA_DATABASE_URI=$$$$ \
--build-arg UNK_ANA_SMTP_URI=$$$$ \
--build-arg UNK_ANA_CABLE_URL=ws://localhost:81/cable/ \
--build-arg UNK_ANA_SECRET_KEY_BASE=GOTO`


#### Build backend image production  
`docker build -t unk-rails-backend-production /C/users/houssem/perso/track-web/. \
--build-arg RAILS_ENV=production \
--build-arg UNK_ANA_DATABASE_URI=$$$$ \
--build-arg UNK_ANA_SMTP_URI=$$$ \
--build-arg UNK_ANA_CABLE_URL=$$$ \
--build-arg UNK_ANA_SECRET_KEY_BASE=$$$`


#### Build api image 
`docker build -t unk-go-api /C/go-work/src/unknown-api/.`

#### Build screen shot
`docker build -t unk-node-screen-shot /c/Users/houssem/perso/others/screen-shot/.`


## Docker compose staging 


## Docker compose production 



# RUN DOCKERS 

## Rails 


```
 docker run -p 3005:3000 -e UNK_ANA_REDIS_URI=redis://host.docker.internal  -e UNK_ANA_DATABASE_URI=postgres://postgre s:root@host.docker.internal/unk_ana_staging -e UNK_ANA_APP_NAME="Unk an" -e UNK_ANA_STRIPE_API_KEY=TODO -e UNK_ANA_APP_ HOST=http://localhost:3002 -e UNK_ANA_DEFAULT_PAGE_TITLE="Unk analytics" -e UNK_ANA_REDIS_CHANNEL_PREFIX=staging -e RAI LS_ENV=staging -e UNK_ANA_SMTP_URI=smtp://apikey:<Replace_it>@ smtp.sendgrid.net:587  unk-rails-backend-staging:latest
```





## Golang  
```
 docker run -p 8001:8000  -e UNK_ANA_REDIS_URI=redis://host.docker.internal  -e UNK_ANA_TRACK_CHANNEL_NAME=channel  -e
  UNK_ANA_DATABASE_URI=postgres://postgres:root@host.docker.internal/unk_ana_staging?sslmode=disable  -e PORT=8000  -e U
 NK_ANA_BUCKET_TOKEN_KEY=bucket_staging  -e UNK_ANA_SCREENSHOT_SECRET_KEY=secret_12345_change_me  unk-go-api
 time="2020-02-11T02:03:50Z" level=info msg="database server :postgres://postgres:root@host.docker.internal/unk_ana_staging?sslmode=disable"
```