select * from rsyssnt0 where sntopname = rpad('HUANGXH214',16);

-----A230709411, 4A5 , HUANGXH214      , 5B9D90AD23DD57F3F47E67F64D443A66, 黃暄惠    , null, 7300, null, null, 20240717, 20240717, , 學士培訓            , 林口      , null, 維運管理處                    , 20250728, ----------------------------6-----------1111-11-------1----1--2--, null, -, -, -, -, 1, -, -, 1, -, -, -, -, -, 1, -, bdb1kVK`, bWQaMTSeN, -, -, -, -, -, -, -, -, -, -, -, -, 1, 1, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -, -

select distinct sntext from rsyssnt0;

select * from vhpnpulbx where idno = 'A230709411';

select DISTINCT LOC from VHPNPULBX;

DESCRIBE rsyssnt0;

select sntidno, sntpass3, sntpass2, sntopid, sntcname from rsyssnt0  where sntopname = rpad('HUANGXH214',16);

select cnm from rtnguserlimit where idno =: idno;

select * from rsyssnt0 where SNTOPNAME = 'HUANGXH214';

SELECT * from vhpnpulbx;



select START_DATE from rtngstrd;

SELECT * from user_users;

desc dba_tablespaces;

desc user_tablespaces;

SELECT * FROM ALL_TABLES ORDER BY OWNER;

SELECT * FROM USER_TABLES;

select TABLESPACE_NAME ,RETENTION, NEXT_EXTENT,BLOCK_SIZE from user_tablespaces;


SELECT tablespace_name, file_name, bytes, maxbytes, autoextensible 
FROM dba_data_files 
ORDER BY tablespace_name;


select property_name,property_value from database_properties 
where property_name LIKE '%CHARACTERSET';

select parameter,value from nls_session_parameters;

SELECT name, value FROM v$diag_info;

-- 查看依賴關係
SELECT NAME, REFERENCED_NAME, REFERENCED_TYPE
FROM USER_DEPENDENCIES
WHERE NAME = 'vsyssnt0'
AND REFERENCED_TYPE = 'TABLE';

-- 查看view的定義
SELECT TEXT 
FROM USER_VIEWS 
WHERE VIEW_NAME = 'vsyssnt0';