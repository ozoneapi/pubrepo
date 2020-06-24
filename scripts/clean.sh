cd $OZONE_HOME/pubrepo

for d in */ ; do
    echo "$d"
    cd $d
    rm -f package-lock.json

    rm -rf node_modules

    cd ..

done
