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

* Install libq-dev (native lib tool for pg). For alpine image we use `postgresql-dev` instead .

* Configuration

  `bundle install`

* Database creation

Create your database

* Database initialization

run `(bundle exec ) db migrate`


### For deployment process, see [deployment](docs/deployment.md)

### SDK JS 

The sdk is build with rollup, inside [web-sdk-cli](./web-sdk-cli/src)


* Services (job queues, cache servers, search engines, etc.)
