ng build
sudo rm -Rf /var/www/html/*	 
sudo cp -R ./dist/* /var/www/html
sudo chown -R www-data /var/www/html/
sudo service nginx restart
rm /home/gilles/projets/ost-front/html.tar.gz
cd /var/www/html
tar -czvf /home/gilles/projets/ost-front/html.tar.gz *
cd /home/gilles/projets/ost-front/
