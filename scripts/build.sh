cd $OZONE_HOME/pubrepo

for i in $(cat ./scripts/modules.csv); do
    echo $i
    cd $i
    npm install
    cd ..
done
