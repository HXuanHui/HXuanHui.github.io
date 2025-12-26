-------connect data
SELECT *
FROM v$session
WHERE username IS NOT NULL
ORDER BY logon_time DESC;

-----sql history
SELECT sql_id, parsing_schema_name AS username, 
       sql_text, last_active_time, 
       executions, elapsed_time/1000000 AS elapsed_seconds
FROM v$sql
where parsing_schema_name = 'SYS'
ORDER BY last_active_time DESC;

select * from rsyssnt0;
DESCRIBE rsyssnt0;

select * from rtnguserlimit;



DECLARE

   Cursor TNGJob_Lst IS
      select * from rtngstrd
      where (xmonth like '%' || to_char(sysdate+1,'MM') || '%'
             or xmonth is null)
        and (xday like '%' || to_char(sysdate+1,'DD') || '%' or xday is null
             or xday like '%' || decode(to_char(sysdate+1,'DD'),
                                 to_char(last_day(sysdate+1),'DD'),
                                 '32','非月底日') || '%'
             or xday like '%' || decode(to_char(sysdate+1,'DD'),
                                 to_char(to_char(last_day(sysdate+1),'DD')-1),
                                 '33','非月底前一日') || '%')
        and (xweek like '%' || to_char(to_char(sysdate+1,'D')-1) || '%'
             or xweek is null)
        and xpause is null
        and (start_date is null or start_date <= to_char(sysdate+1,'YYYYMMDD'))
      order by xseq, jobname;

   JobDat  VARCHAR2(8);

   Job_Itm  TNGJob_Lst%rowtype;

   mERRCODE  NUMBER(10);
   mERRMSG  VARCHAR2(150);

BEGIN

   JobDat := to_char(sysdate+1,'YYYYMMDD');

   Delete From rtngjob Where dat = JobDat;
   commit;

   Open TNGJob_Lst;
   
      Loop

      Fetch TNGJob_Lst Into Job_Itm;
      Exit When TNGJob_Lst%NotFound;

      Insert Into rtngjob (DAT, JOBNAME, CLASS, NODE, SEQ, XTYPE, APNAME,
                           XTIME,RERUN, XREMA, XQUEUE, JOBSET, JOBSET_NO)
      Values (JobDat, Job_Itm.JOBNAME,  Job_Itm.CLASS, Job_Itm.NODE,
              Job_Itm.XSEQ, Job_Itm.XTYPE, Job_Itm.APNAME, Job_Itm.XTIME,
              Job_Itm.RERUN, Job_Itm.XREMA, Job_Itm.XQUEUE, Job_Itm.JOBSET, Job_Itm.JOBSET_NO);

   End Loop;

   commit;

   Close TNGJob_Lst;

EXCEPTION WHEN OTHERS THEN

   IF TNGJob_Lst%IsOpen then
        Close TNGJob_Lst;
   End IF;

   mERRCODE := SQLCODE;
   mERRMSG := SQLERRM;

   insert into rtngerr(ProcNm, DT, JobNm, Msg)
   values('TNGJOBSC', sysdate, '', mERRCODE || ':' || mERRMSG);

   commit;

END;

select DISTINCT PROCNM from RTNGERR;

SELECT * FROM RTNGERR where PROCNM = 'PTNGJBREC';

UPDATE RTNGJOB SET BTIME = '11:59:33', ETIME = '11:59:34' WHERE JOBNAME = '通訊診療同意書' and SEQ = '0000' and NODE = 'L3A0' and XQUEUE = '00' and DAT = '20250522';

SELECT * FROM RTNGJOB WHERE JOBNAME = '通訊診療同意書' and SEQ = '0000' and NODE = 'L3A0' and XQUEUE = '00' and DAT = '20250523';

SELECT * FROM rtngjob;

UPDATE RTNGJOB SET BTIME = :BTIME,ETIME = :ETIME WHERE JOBNAME = :JOBNAME and SEQ = :SEQ and NODE = :NODE and XQUEUE = :XQUEUE and DAT = :DAT;

DESCRIBE RTNGJOB;

UPDATE RTNGJOB SET BTIME = :BTIME, ETIME = :ETIME WHERE JOBNAME = :JOBNAME and SEQ = :SEQ and NODE = :NODE and XQUEUE = :XQUEUE and DAT = :DAT;

commit;

SELECT * from user_users;

desc dba_tablespaces;

desc user_tablespaces;

select TABLESPACE_NAME ,RETENTION, NEXT_EXTENT,BLOCK_SIZE from dba_tablespaces;

select TABLESPACE_NAME ,RETENTION, NEXT_EXTENT,BLOCK_SIZE from user_tablespaces;

select TABLESPACE_NAME, status, contents, logging, plugged_in, bigfile, extent_management, allocation_type from dba_tablespaces ;

SELECT tablespace_name, file_name, bytes, maxbytes, autoextensible 
FROM dba_data_files 
ORDER BY tablespace_name;

SELECT name FROM v$datafile ORDER BY 1;

select property_name,property_value from database_properties 
where property_name LIKE '%CHARACTERSET';

SELECT * FROM v$database;

SELECT 
  activeblks "Active Blocks",
  unexpiredblks "Unexpired Blocks", 
  expiredblks "Expired Blocks",
  tuned_undoretention "Auto-tuned Retention"
FROM v$undostat 
WHERE rownum = 1;


SELECT name, value FROM v$diag_info;

SHOW PARAMETER MEMORY_TARGET;

SELECT value FROM v$diag_info WHERE name = 'Diag Trace';

SELECT * FROM role_tab_privs WHERE role='CNS';

SELECT privilege FROM role_sys_privs WHERE role='CNS' ORDER BY 1;

SELECT * FROM dba_tab_privs WHERE grantee='CNS';

SELECT granted_role, admin_option FROM dba_role_privs WHERE grantee='CNS';

SELECT privilege FROM dba_sys_privs WHERE grantee='CNS';

SELECT * FROM session_roles;

SELECT username, account_status, default_tablespace FROM dba_users WHERE username='CGHCNS';

SELECT * FROM v$nls_parameters;

show parameter db_block_size


SHOW PARAMETER processes;

SELECT * FROM v$queue WHERE type = 'DISPATCHER';

SHOW PARAMETER shared_servers;

SHOW PARAMETER dispatchers

