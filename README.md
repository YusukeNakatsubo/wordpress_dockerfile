# WordPress on Docker

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
       - ./:/var/www/html # setting root

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

```bash
$ touch .gitignore
```

Reference source -> [https://gist.github.com/samhotchkiss/6190462](https://gist.github.com/samhotchkiss/6190462)
```
# This is a template .gitignore file for git-managed WordPress projects.
#
# Fact: you don't want WordPress core files, or your server-specific
# configuration files etc., in your project's repository. You just don't.
#
# Solution: stick this file up your repository root (which it assumes is
# also the WordPress root directory) and add exceptions for any plugins,
# themes, and other directories that should be under version control.
#
# See the comments below for more info on how to add exceptions for your
# content. Or see git's documentation for more info on .gitignore files:
# http://kernel.org/pub/software/scm/git/docs/gitignore.html

# Ignore everything in the root except the "wp-content" directory.
/*
!.gitignore
!wp-content/

# Ignore everything in the "wp-content" directory, except the "plugins"
# and "themes" directories.
wp-content/*
!wp-content/plugins/
!wp-content/themes/

# Ignore everything in the "plugins" directory, except the plugins you
# specify (see the commented-out examples for hints on how to do this.)
# wp-content/plugins/*
# !wp-content/plugins/my-directory-plugin/

# Ignore everything in the "themes" directory, except the themes you
# specify (see the commented-out example for a hint on how to do this.)
# wp-content/themes/*
# !wp-content/themes/my-theme/
```
