# README
This Repository is test for WordPress on Docker.

## 1. Install WordPress
[Reference](https://docs.docker.jp/compose/wordpress.html)

```yml
version: '3'

services:
   db:
     image: mysql:5.7
     volumes:
       - db_data:/var/lib/mysql
     restart: always
     environment:
       MYSQL_ROOT_PASSWORD: somewordpress
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD: wordpress

   wordpress:
     depends_on:
       - db
     image: wordpress:latest
     ports:
       - "8000:80"
     restart: always
     environment:
       WORDPRESS_DB_HOST: db:3306
       WORDPRESS_DB_USER: wordpress
       WORDPRESS_DB_PASSWORD: wordpress
volumes:
    db_data:
```

```bash
# create
$ docker-compose up -d

# access http://localhost:8000/
# install WordPress

# shotdown
$ docker-compose down

# shotdown & remove DB
docker-compose down --volumes
```
