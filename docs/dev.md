### Create DB
`UNK_ANA_DATABASE_URI=postgres://postgres:root@127.0.0.1:5432/track-web_development UNK_ANA_REDIS_URI=redis://redis rake db:create`
### migrate 
`UNK_ANA_DATABASE_URI=postgres://postgres:root@127.0.0.1:5432/track-web_development UNK_ANA_REDIS_URI=redis://redis rake db:migrate`
### RUN
`UNK_ANA_DATABASE_URI=postgres://postgres:root@127.0.0.1:5432/track-web_development  UNK_ANA_SMTP_URI=xxxxx  UNK_ANA_REDIS_URI=redis://localhost rails s`