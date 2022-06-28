cd $OZONE_HOME/pubrepo

for i in $(cat ./scripts/modules.csv); do
    echo $i
    cd $i
    yarn install --frozen-lockfile
    cd ..
done
