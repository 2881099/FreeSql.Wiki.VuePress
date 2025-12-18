# FreeIM

## FreeIM v2.0.0

- 调整：已将 ClientId Guid 改为 long；
- 修复：JoinChan/LeaveChan 数量统计问题；
- 增加：SendBroadcastMessage 广播消息；
- 优化：SendChanMessage 性能；

FreeIM 使用 websocket 协议实现简易、高性能（单机支持5万+连接）、集群即时通讯组件，支持点对点通讯、群聊通讯、上线下线事件消息等众多实用性功能。

使用场景：好友聊天、群聊天、直播间、实时评论区、游戏。

_接受定制项目开发，详细请联系作者_

开源地址：[https://github.com/2881099/FreeIM](https://github.com/2881099/FreeIM)

扩展资料：[《C#.NET im 聊天通讯架构设计 -- FreeIM 支持集群、职责分明、高性能》](https://www.cnblogs.com/FreeSql/p/16632727.html)

> dotnet add package FreeIM

# 定制服务

- 前端：Flutter、uniapp
- 后端：.NET10 + Redis + MySql + Clickhouse + Kafka (高性能、万人群、群直播）
- 功能：好友、群、签到、红包、直播、语聊、后台管理系统、系统推送
- 配置：会员等级、谁不能删除谁、谁能领红包等等
- 价格：根据功能谈价

| <img width="391" height="844" src="https://github.com/user-attachments/assets/309b67ce-d15c-47ca-b9b0-d26304245a18" /> | <img width="392" height="843" src="https://github.com/user-attachments/assets/46149156-c2bb-4a37-b22c-339aa9cab28c" /> |
| -- | -- |
| <img width="389" height="844" src="https://github.com/user-attachments/assets/ad19962f-7e9c-46da-88cc-79548f37ee09" /> | <img width="390" height="845" src="https://github.com/user-attachments/assets/f9581338-fe92-41c6-ad72-568d5f508876" /> |
| <img width="387" height="844" src="https://github.com/user-attachments/assets/46f5f9ad-f53f-4b47-8bad-23cec5081704" /> | <img width="387" height="844" src="https://github.com/user-attachments/assets/aa0b33af-c655-44bd-b8a5-d7fedefcefaa" /> |

<img width="1250" height="1191" alt="image" src="https://github.com/user-attachments/assets/75fb9117-c922-4e6e-99dc-27e9c36fa99d" />

## ImServer 服务端

```csharp
public void Configure(IApplicationBuilder app)
{
    app.UseFreeImServer(new ImServerOptions
    {
        Redis = new FreeRedis.RedisClient("127.0.0.1:6379,poolsize=5"),
        Servers = new[] { "127.0.0.1:6001" }, //集群配置
        Server = "127.0.0.1:6001"
    });
}
//dotnet run --urls=http://127.0.0.1:6001
```

> 一套永远不需要迭代更新的 `ImServer` 服务端，支持 .NET6.0、.NETCore2.1+、NETStandard2.0

## WebApi 业务端

```csharp
public void Configure(IApplicationBuilder app)
{
    //...

    ImHelper.Initialization(new ImClientOptions
    {
        Redis = new FreeRedis.RedisClient("127.0.0.1:6379,poolsize=5"),
        Servers = new[] { "127.0.0.1:6001" }
    });

    ImHelper.EventBus(
        t => Console.WriteLine(t.clientId + "上线了"),
        t => Console.WriteLine(t.clientId + "下线了"));
}
```

| ImHelper方法          | 参数                                 | 描述                            |
| --------------------- | ------------------------------------ | ------------------------------- |
| PrevConnectServer     | (clientId, string)                   | 在终端准备连接 websocket 前调用 |
| SendMessage           | (发送者, 接收者, 消息内容, 是否回执) | 发送消息                        |
| GetClientListByOnline | -                                    | 返回所有在线clientId            |
| HasOnline             | clientId                             | 判断客户端是否在线              |
| EventBus              | (上线委托, 离线委托)                 | socket上线与下线事件            |

| 频道                  | 参数                         | 描述                               |
| --------------------- | ---------------------------- | ---------------------------------- |
| JoinChan              | (clientId, 频道名)           | 加入                               |
| LeaveChan             | (clientId, 频道名)           | 离开                               |
| GetChanClientList     | (频道名)                     | 获取频道所有clientId               |
| GetChanList           | -                            | 获取所有频道和在线人数             |
| GetChanListByClientId | (clientId)                   | 获取用户参与的所有频道             |
| GetChanOnline         | (频道名)                     | 获取频道的在线人数                 |
| SendChanMessage       | (clientId, 频道名, 消息内容) | 发送消息，所有在线的用户将收到消息 |
| SendBroadcastMessage  | (clientId, 频道名, 消息内容) | 发送广播消息                       |

- clientId 应该与用户id相同，或者关联；
- 频道适用临时的群聊需求，如聊天室、讨论区；

> ImHelper 支持 .NetFramework 4.5+、.NetStandard 2.0

## Html5 终端

终端连接 websocket 前，应该先请求 `WebApi` 获得授权过的地址(ImHelper.PrevConnectServer)，伪代码：

```javascript
ajax("/prev-connect-imserver", function (data) {
  var url = data; //此时的值：ws://127.0.0.1:6001/ws?token=xxxxx
  var sock = new WebSocket(url);
  sock.onmessage = function (e) {
    //...
  };
});
```
