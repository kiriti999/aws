USERNAME=$1
PASSWORD=$2
DATABASE=$3
HOST=$4
PORT=$5
SCHEMA=$6

if [ -z "$1" ] || [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ] || [ -z "$5" ]; then
    echo "invalid arguments" >&2
    exit
fi

if [ -z "$6" ]; then
    echo "Schema not passed"
    SCHEMA=public
else
    echo "Creating schema"
    echo "Create Schema IF NOT EXISTS ${SCHEMA}" | psql -U $USERNAME -d $DATABASE
fi

echo "creating liquibase file at project level"
rm -rf ./liquibase/liquibase.properties
echo "url: jdbc:postgresql://${HOST}:${PORT}/${DATABASE}?currentSchema=${SCHEMA}&user=${USERNAME}&password=${PASSWORD}" >>./liquibase/liquibase.properties
echo "changeLogFile: ./liquibase/master.xml" >>./liquibase/liquibase.properties
echo "classpath: /liquibase/lib/postgresql-42.3.3.jar" >>./liquibase/liquibase.properties
echo "running docker container and applying scripts"
# docker compose -f ./liquibase/docker-compose.yml up
