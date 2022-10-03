-- liquibase formatted sql
--changeset AmyS:createTable_new_table_01
CREATE TABLE new_table_01 (
   ID int NOT NULL,
   NAME varchar(20) NULL,
   REGION varchar(20) NULL,
   MARKET varchar(20) NULL
)