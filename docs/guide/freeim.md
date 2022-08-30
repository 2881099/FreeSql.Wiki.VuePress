# FreeIM

FreeIM 使用 websocket 协议实现简易、高性能（单机支持5万+连接）、集群即时通讯组件，支持点对点通讯、群聊通讯、上线下线事件消息等众多实用性功能。

使用场景：好友聊天、群聊天、直播间、实时评论区、游戏。

开源地址：[https://github.com/2881099/FreeIM](https://github.com/2881099/FreeIM)

扩展资料：[《C#.NET im 聊天通讯架构设计 -- FreeIM 支持集群、职责分明、高性能》](https://www.cnblogs.com/FreeSql/p/16632727.html)

> dotnet add package FreeIM

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

| ImHelper方法 | 参数 | 描述 |
| - | - | - |
| PrevConnectServer | (clientId, string) | 在终端准备连接 websocket 前调用 |
| SendMessage | (发送者, 接收者, 消息内容, 是否回执) | 发送消息 |
| GetClientListByOnline | - | 返回所有在线clientId |
| HasOnline | clientId | 判断客户端是否在线 |
| EventBus | (上线委托, 离线委托) | socket上线与下线事件 |

| 频道 | 参数 | 描述 |
| - | - | - |
| JoinChan | (clientId, 频道名) | 加入 |
| LeaveChan | (clientId, 频道名) | 离开 |
| GetChanClientList | (频道名) | 获取频道所有clientId |
| GetChanList | - | 获取所有频道和在线人数 |
| GetChanListByClientId | (clientId) | 获取用户参与的所有频道 |
| GetChanOnline | (频道名) | 获取频道的在线人数 |
| SendChanMessage | (clientId, 频道名, 消息内容) | 发送消息，所有在线的用户将收到消息 |

- clientId 应该与用户id相同，或者关联；
- 频道适用临时的群聊需求，如聊天室、讨论区；

> ImHelper 支持 .NetFramework 4.5+、.NetStandard 2.0

## Html5 终端

终端连接 websocket 前，应该先请求 `WebApi` 获得授权过的地址(ImHelper.PrevConnectServer)，伪代码：

```javascript
ajax('/prev-connect-imserver', function(data) {
    var url = data; //此时的值：ws://127.0.0.1:6001/ws?token=xxxxx
    var sock = new WebSocket(url);
    sock.onmessage = function (e) {
        //...
    };
})
```

## 💕 Donation (捐赠)

> 感谢你的打赏

- [Alipay](https://www.cnblogs.com/FreeSql/gallery/image/338860.html)

- [WeChat](https://www.cnblogs.com/FreeSql/gallery/image/338859.html)

## 🗄 License (许可证)

[MIT](LICENSE)
