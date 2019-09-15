cd /usr/o3/pubrepo

for i in $(cat ./scripts/modules.csv); do
    echo $i
    cd $i
    npm install
    cd ..
done
