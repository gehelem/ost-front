ng build
sudo rm -Rf /var/www/html/*	 
sudo cp -R ./dist/* /var/www/html
sudo chown -R www-data /var/www/html/
sudo service nginx restart
