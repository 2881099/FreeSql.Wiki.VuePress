---
home: true
heroImage: /logo.png
heroText: 🦄 FreeSql
tagline: 功能简单、强大的对象关系映射（O/RM）组件，支持 .NET Core 2.1+、.NET Framework 4.0+、Xamarin，国产首个支持 AOT 发布的 ORM✨
actions:
  - text: 进入文档 💡
    link: /guide/
    type: primary
  - text: 视频教程 💻
    link: https://www.bilibili.com/video/BV18p4y1d7iC/
    type: default
features:
  - title: 轻松入门
    details: 💡 5 分钟入门，1 小时成为高手
    link: /guide/
  - title: 超前理念
    details: MIT 开源，零依赖包
  - title: 数据库
    details: 支持常见 28 种数据库
    link: /guide/
  - title: 查询
    details: 多表/嵌套/联合/递归等
    link: /guide/select
  - title: CodeFirst
    details: 实体类自动同步表结构
    link: /guide/code-first
  - title: DbFirst
    details: 从数据库导入实体类
    link: /guide/db-first
  - title: 导航属性
    details: 一对多/多对多，级联
    link: /guide/navigate-attribute
  - title: 读写分离
    details: 一行代码实现读写分离
    link: /guide/read-write-splitting
  - title: 高性能
    details: BulkCopy 插入/更新/保存
    link: /guide/performance
  - title: 大数据
    details: 自动分表/ClickHouse
    link: /guide/sharding
  - title: 多租户
    details: 提供三种多租户方案
    link: /guide/multi-tenancy
  - title: 低代码
    details: 动态操作，无实体API
    link: /guide/lowcode
footer: MIT Licensed | Copyright © 2018-present nicye
---

## 💕 Donation (捐赠)

> 扫码捐助请作者喝一杯咖啡

<div class="vp-donation">
    <div class="vp-donation-item">
        <img src="/barcode_2x1.png" style="width:400px;height:255px;" />
    </div>
    <div class="vp-donation-item">
        <a style="margin-left:20px;cursor:pointer" target="_blank" href="https://curl.qcloud.com/lj8Rbc9Y">
            <img src="/rhino-design.png" style="width:400px;" />
            <h4>【腾讯云】2核2G云服务器新老同享 99元/年，续费同价</h4>
        </a>
    </div> 
    <div class="vp-donation-item">
        <a style="margin-left:20px;cursor:pointer" target="_blank" href="https://t.aliyun.com/U/rs0mOj">
            <img src="/aliyun.png" style="width:400px;" />
            <h4>【阿里云】云服务器经济型e实例/2核2G/3M/40g，新人专享渠道特惠价只要99元！</h4>
        </a> 
    </div> 
</div>

## 👯 Contributors (贡献者)

<a href="https://contributors-img.web.app/image?repo=dotnetcore/FreeSql">
  <img src="https://contributors-img.web.app/image?repo=dotnetcore/FreeSql" />
</a>

## 🗄 License (许可证)

[MIT](https://github.com/dotnetcore/FreeSql/blob/master/LICENSE)

<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-7223766210897652"
     data-ad-slot="3532742594"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>

<style>
.vp-donation {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center; /* 确保项目在交叉轴上居中对齐 */
    padding: 20px;
}

.vp-donation-item {
    flex-basis: calc(33.333% - 20px); /* 基础大小为三分之一减去间距 */
    max-width: calc(33.333% - 20px); /* 最大宽度也是三分之一减去间距 */
    margin: 10px;
    text-align: center;
}

.vp-donation-item img {
    width: 100%; /* 图片宽度充满容器 */
    height: auto; /* 高度自动调整 */
}

.vp-donation-item a {
    text-decoration: none;
    color: inherit;
    display: inline-block;
    margin-top: 10px;
}

.vp-donation-item h4 {
    margin: 5px 0;
    font-size: 16px;
}

/* 媒体查询，针对中等屏幕设备 */
@media (max-width: 1024px) {
    .vp-donation-item {
        flex-basis: calc(50% - 20px); /* 中等屏幕宽度下，一行显示两个 */
        max-width: calc(50% - 20px);
    }
}

/* 媒体查询，针对小屏幕设备 */
@media (max-width: 600px) {
    .vp-donation-item {
        flex-basis: 100%; /* 小屏幕宽度下，一行显示一个 */
        max-width: 100%;
    }
}
</style>
