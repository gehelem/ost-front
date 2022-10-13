ng build
sudo cp -R ./dist/* /var/www/html
sudo chown -R www-data /var/www/html/
sudo service nginx restart
