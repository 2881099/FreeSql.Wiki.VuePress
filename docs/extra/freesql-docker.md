# Docker+ FreeSql

## .net5+Docker+ Encryption(ssl/tls) handshake failed

.net5 网站使用Sqlserver数据库部署在docker容器内运行报主库链接失败

### 环境

数据库：Sqlserver2014
网站程序：.Net5
Docker版本：Docker version 19.03.13,
.net5环境镜像源：mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim
Centos版本：CentOS Linux release 7.9.2009 (Core)

### 使用原生方式进行测试

```csharp
using (SqlConnection connection = new SqlConnection("Data Source=xxxxx;User Id=sa;Password=xxxxxx;Initial Catalog=xxxxxxxx;Pooling=true;Min Pool Size=1;"))
{
    connection.Open();
    connection.Close();
    connection.Dispose();
}
```

### 报错

A connection was successfully established with the server, but then an error occurred during the pre-login handshake. (provider: SSL Provider, error: 31 - Encryption(ssl/tls) handshake failed)

### 最终解决方案

在dockerfile里面加上这么两句

```Dockerfile
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf
```

**将TLSv1.2设为TLSv1，只能是设为TLSv1而不是设为TLSv1.0**

## 原文链接

- [.net5 网站使用Sqlserver数据库部署在docker容器内运行报主库链接失败 · Issue #650 · dotnetcore/FreeSql (github.com)](https://github.com/dotnetcore/FreeSql/issues/650)
