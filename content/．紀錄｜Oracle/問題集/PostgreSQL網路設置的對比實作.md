

### 基本連線設定與Oracle的差異

**PostgreSQL的設定方式：**

```bash
# 修改postgresql.conf
listen_addresses = '*'  # 相當於Oracle的listener設定多個地址
port = 5432

# 修改pg_hba.conf (相當於Oracle的存取控制)
host    all    all    192.168.1.0/24    scram-sha-256

# 重新載入設定
$ sudo systemctl reload postgresql
# 或
$ pg_ctl reload
```

**連線方式對比：**

```bash
# Oracle方式
$ sqlplus hr/password@hostname:1521/service_name

# PostgreSQL方式  
$ psql -h hostname -p 5432 -U username -d database
```

### PostgreSQL的企業級網路配置

**使用連線池 (相當於Oracle的共享伺服器)：**

```bash
# 安裝PgBouncer
$ sudo apt install pgbouncer

# 配置pgbouncer.ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = scram-sha-256
pool_mode = transaction
max_client_conn = 100
default_pool_size = 20

# 連線到PgBouncer
$ psql -h localhost -p 6432 -U username -d mydb
```

#ORACLE #postgreSQL 