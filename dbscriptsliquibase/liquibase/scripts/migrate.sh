echo "Running:Db Migration"
npm run migrate -- ${1} ${2} ${3} ${4} ${5}
cat ./liquibase/liquibase.properties
liquibase --defaultsFile=./liquibase/liquibase.properties update
