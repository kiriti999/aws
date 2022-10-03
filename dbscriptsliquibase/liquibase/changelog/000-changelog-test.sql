-- liquibase formatted sql

-- changeset changelog logicalFilePath:path-independent
CREATE TABLE db_migration_test (
	id 				SERIAL NOT NULL,
	userid 			VARCHAR(150) NOT NULL,
	username 		VARCHAR(150) NOT NULL,
	org_id 			VARCHAR(200) NOT NULL,
	created_by      varchar(128) Default 'System',
	created_at      TimeStamp Default current_timestamp,
	updated_by      varchar(128) Default 'System',
	updated_at      TimeStamp Default current_timestamp,
	PRIMARY KEY(org_id)
);
-- rollback drop table role;