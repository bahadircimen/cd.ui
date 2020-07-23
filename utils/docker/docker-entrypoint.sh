#!/bin/bash
echo "1-shows dir"

ls -la

#! mevcut konum da html adinda folder varsa
if [ -d "html" ]; then
  configsDirectory='./configs'
  distDirectory='./html'
else
  configsDirectory='../../configs'
  distDirectory='../../dist'
fi

echo "2- show NodeEnv value"
echo $NODE_ENV


configFile=`echo $NODE_ENV.config.js | tr '[:upper:]' '[:lower:]'`
configFilePath=`echo $configsDirectory/$configFile`
distConfig=`echo $distDirectory/config.js`

# touch $distConfig
# cat <<EOF >$distConfig
# $(cat $configFilePath)
# EOF


if [ -f $distConfig ]; then
  rm -rf $distConfig
fi

echo "3-show distConfig path"
echo $distConfig

echo "4-show config childs"
ls -la html/

echo "5-show error file"


echo $(cat $configFilePath) >> $distConfig

# Replace Config Function
sed -i -e 's/module.exports/window.HBConfig/g' $distConfig

envFile=`cat $distConfig`

sed -i -e 's|<!--ENVIRONMENT-->|<script>'"$envFile"'</script>|g' $distDirectory/index.html

exec nginx -g 'daemon off;' "$@"