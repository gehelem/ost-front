ng build
rm -Rf ./www/*
cp -R ./dist/* ./www
npx cap copy android
npx cap update
npx cap open android
