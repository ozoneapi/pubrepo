cd $OZONE_HOME/pubrepo

for d in */ ; do
    echo "$d"
    cd $d
    
    rm -rf node_modules

    cd ..

done
