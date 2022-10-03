-- liquibase formatted sql

-- changeset personal:002-changelog logicalFilePath:path-independent
insert into db_migration_test(id, userid, username, org_id) values(1, 'kiriti', 'kiriti999@gmail.com', 'test_org');
insert into db_migration_test(id, userid, username, org_id) values(2, 'test', 'test@gmail.com', 'test_org');
-- rollback delete from db_migration_test where id in (1, 2);
