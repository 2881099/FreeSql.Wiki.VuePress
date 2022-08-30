# FreeRedis

`CSRedisCore` 是 .NETFramework 4.0 及以上 访问 redis-server 的客户端组件，也是 FreeSql 作者早年发布的 nuget 版本。

后来重构了更简易的 `FreeRedis`，目前推荐大家使用 `FreeRedis`。

开源地址：[https://github.com/2881099/FreeRedis](https://github.com/2881099/FreeRedis)

- 🌈 所有方法名与 redis-cli 保持一致
- 🌌 支持 Redis 集群（服务端要求 3.2 及以上版本）
- ⛳ 支持 Redis 哨兵模式
- 🎣 支持主从分离（Master-Slave）
- 📡 支持发布订阅（Pub-Sub）
- 📃 支持 Redis Lua 脚本
- 💻 支持管道（Pipeline）
- 📰 支持事务
- 🌴 支持 GEO 命令（服务端要求 3.2 及以上版本）
- 🌲 支持 STREAM 类型命令（服务端要求 5.0 及以上版本）
- ⚡ 支持本地缓存（Client-side-cahing，服务端要求 6.0 及以上版本）
- 🌳 支持 Redis 6 的 RESP3 协议

## 🚀 快速入门

```csharp
public static RedisClient cli = new RedisClient("127.0.0.1:6379,password=123,defaultDatabase=13");
//cli.Serialize = obj => JsonConvert.SerializeObject(obj);
//cli.Deserialize = (json, type) => JsonConvert.DeserializeObject(json, type);
cli.Notice += (s, e) => Console.WriteLine(e.Log); //打印命令日志

cli.Set("key1", "value1");
cli.MSet("key1", "value1", "key2", "value2");

string value1 = cli.Get("key1");
string[] vals = cli.MGet("key1", "key2");
```

> 支持 STRING、HASH、LIST、SET、ZSET、BITMAP、HyperLogLog、GEO、Stream 以及布隆过滤器等。

| 参数               | 默认值     | 说明 |
| :---------------- | --------: | :------------------- |
| protocol          | RESP2     | 若使用 RESP3 协议，你需要 Redis 6.0 环境 |
| user              | \<empty\> | Redis 服务端用户名，要求 Redis 6.0 环境 |
| password          | \<empty\> | Redis 服务端密码 |
| defaultDatabase   | 0         | Redis 服务端数据库 |
| max poolsize      | 100       | 连接池最大连接数 |
| min poolsize      | 5         | 连接池最小连接数 |
| idleTimeout       | 20000     | 连接池中元素的空闲时间（单位为毫秒 ms），适用于连接到远程服务器 |
| connectTimeout    | 10000     | 连接超时，单位为毫秒（ms） |
| receiveTimeout    | 10000     | 接收超时，单位为毫秒（ms） |
| sendTimeout       | 10000     | 发送超时，单位为毫秒（ms） |
| encoding          | utf-8     | 字符串字符集 |
| retry             | 0         | 协议发生错误时，重试执行的次数 |
| ssl               | false     | 启用加密传输 |
| name              | \<empty\> | 连接名，使用 CLIENT LIST 命令查看 |
| prefix            | \<empty\> | `key` 前辍，所有方法都会附带此前辍，cli.Set(prefix + "key", 111); |

> IPv6: [fe80::b164:55b3:4b4f:7ce6%15]:6379

## 🎣 Master-Slave (读写分离)

```csharp
public static RedisClient cli = new RedisClient(
    "127.0.0.1:6379,password=123,defaultDatabase=13",
    "127.0.0.1:6380,password=123,defaultDatabase=13",
    "127.0.0.1:6381,password=123,defaultDatabase=13"
    );

var value = cli.Get("key1");
```

> 写入时连接 127.0.0.1:6379，读取时随机连接 6380 6381

## ⛳ Redis Sentinel (哨兵高可用)

```csharp
public static RedisClient cli = new RedisClient(
    "mymaster,password=123", 
    new [] { "192.169.1.10:26379", "192.169.1.11:26379", "192.169.1.12:26379" },
    true //是否读写分离
    );
```

## 🌌 Redis Cluster (集群)

假如你有一个 Redis Cluster 集群，其中有三个主节点(7001-7003)、三个从节点(7004-7006)，则连接此集群的代码：

```csharp
public static RedisClient cli = new RedisClient(
    new ConnectionStringBuilder[] { "192.168.0.2:7001", "192.168.0.2:7002", "192.168.0.2:7003" }
    );
```

## ⚡ Client-side-cahing (本地缓存)

> 服务端要求 6.0 及以上版本

```csharp
cli.UseClientSideCaching(new ClientSideCachingOptions
{
    //本地缓存的容量
    Capacity = 3,
    //过滤哪些键能被本地缓存
    KeyFilter = key => key.StartsWith("Interceptor"),
    //检查长期未使用的缓存
    CheckExpired = (key, dt) => DateTime.Now.Subtract(dt) > TimeSpan.FromSeconds(2)
});
```

## 📡 Subscribe (订阅)

```csharp
using (cli.Subscribe("abc", ondata)) //wait .Dispose()
{
    Console.ReadKey();
}

void ondata(string channel, string data) =>
    Console.WriteLine($"{channel} -> {data}");
```

## 📃 Scripting (脚本)

```csharp
var r1 = cli.Eval("return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}", 
    new[] { "key1", "key2" }, "first", "second") as object[];

var r2 = cli.Eval("return {1,2,{3,'Hello World!'}}") as object[];

cli.Eval("return redis.call('set',KEYS[1],'bar')", 
    new[] { Guid.NewGuid().ToString() })
```
## 💻 Pipeline (管道)

```csharp
using (var pipe = cli.StartPipe())
{
    pipe.IncrBy("key1", 10);
    pipe.Set("key2", Null);
    pipe.Get("key1");

    object[] ret = pipe.EndPipe();
    Console.WriteLine(ret[0] + ", " + ret[2]);
}
```

## 📰 Transaction (事务)

```csharp
using (var tran = cli.Multi())
{
    tran.IncrBy("key1", 10);
    tran.Set("key2", Null);
    tran.Get("key1");

    object[] ret = tran.Exec();
    Console.WriteLine(ret[0] + ", " + ret[2]);
}
```

## 📯 GetDatabase (切库)

```csharp
using (var db = cli.GetDatabase(10))
{
    db.Set("key1", 10);
    var val1 = db.Get("key1");
}
```

## 🔍 Scan (扫描)

> 支持集群模式

```csharp
foreach (var keys in cli.Scan("*", 10, null))
{
    Console.WriteLine(string.Join(", ", keys));
}
```
