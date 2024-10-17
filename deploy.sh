ng build
sudo rm -Rf /var/www/ostserver/*	 
sudo cp -R ./dist/browser/* /var/www/ostserver
sudo chown -R www-data /var/www/ostserver/
sudo service nginx restart
rm /home/gilles/projets/ost-front/html.tar.gz
cd /var/www/ostserver
tar -czvf /home/gilles/projets/ost-front/html.tar.gz *
cd /home/gilles/projets/ost-front/
