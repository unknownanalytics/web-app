On ubuntu (option : WSL 2 ) :

#### Launch redis `redis-server`

#### Launch Postgres `sudo service postgresql start`

#### Create DB

`UNK_ANA_DATABASE_URI=postgres://postgres:root@127.0.0.1:5432/track-web_development UNK_ANA_REDIS_URI=redis://redis rake db:create`

#### Migrate

`UNK_ANA_DATABASE_URI=postgres://postgres:root@127.0.0.1:5432/track-web_development UNK_ANA_REDIS_URI=redis://redis rake db:migrate`

#### RUN APP

`UNK_ANA_DATABASE_URI=postgres://postgres:root@127.0.0.1:5432/track-web_development  UNK_ANA_SMTP_URI=<your_smtp_provider>  UNK_ANA_REDIS_URI=redis://localhost rails s`

