#!/bin/bash

set -ex;

# wp core install
wp core install \
  --url='http://localhost:8000' \
  --title='title' \
  --admin_user='wordpress' \
  --admin_password='wordpress' \
  --admin_email='wordpress@wordpress.com' \
  --allow-root

# wp language core install
wp language core install ja --activate \
  --allow-root

# Error when using method chains. Why?
# wp option update
wp option update timezone_string 'Asia/Tokyo' --allow-root
wp option update date_format 'Y-m-d' --allow-root
wp option update time_format 'H:i' --allow-root

# wp option update
wp option update blogdescription '' \
  --allow-root

# Error when using method chains. Why?
# wp plugin delete
wp plugin delete hello.php --allow-root
wp plugin delete akismet --allow-root

# Error when using method chains. Why?
# wp plugin install
# error -> wp plugin install advanced-custom-fields-repeater-field --activate --allow-root
wp plugin install smart-custom-fields --activate --allow-root
wp plugin install advanced-custom-fields --activate --allow-root
wp plugin install classic-editor --activate --allow-root
wp plugin install custom-post-type-ui --activate --allow-root
wp plugin install custom-post-type-permalinks --activate --allow-root
wp plugin install duplicate-post --activate --allow-root
wp plugin install google-sitemap-generator --activate --allow-root
wp plugin install intuitive-custom-post-order --activate --allow-root
wp plugin install really-simple-csv-importer --activate --allow-root
wp plugin install wp-all-export --activate --allow-root
wp plugin install wp-maintenance-mode --activate --allow-root
wp plugin install wp-multibyte-patch --activate --allow-root

# Error when using method chains. Why?
# Remove Themes
wp theme delete twentynineteen --allow-root
wp theme delete twentytwenty --allow-root
# wp theme delete twentytwentyone --allow-root

# wp option update
# wp option update permalink_structure /%postname%/ --allow-root