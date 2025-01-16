# FreeSql Docs

- [https://freesql.net](https://freesql.net)
- [Download: freesql.net.dist.zip](https://github.com/2881099/FreeSql.Wiki.VuePress/files/11719032/freesql.net.dist.zip)

## install

```bash
npm config set registry https://registry.npmmirror.com
npm install -g pnpm
```

```bash
pnpm install
```

## run

```bash
pnpm docs:dev
```

## build

```bash
pnpm docs:build
```

## Docker Run

```bash
docker pull igeekfan/freesql-doc:latest
docker run --name freesql-doc -d -p 8081:80 igeekfan/freesql-doc:latest
```

这样我们就可以通过 [http://localhost:8081](http://localhost:8081) 访问文档了。

## Docker Build

```bash
docker stop freesql-doc
docker rm freesql-doc
docker rmi igeekfan/freesql-doc
docker build -t igeekfan/freesql-doc .
docker tag igeekfan/freesql-doc igeekfan/freesql-doc:latest
docker login
## 推送到docker hub
docker push igeekfan/freesql-doc:latest
## 运行本地镜像
docker run --name freesql-doc -d -p 8081:80 igeekfan/freesql-doc:latest
```

## vuepress-next

- <https://vuepress.vuejs.org/zh/guide/>

## vuepress-theme-hope

- <https://theme-hope.vuejs.press/zh/>

## 源码

- GitHub [https://github.com/dotnetcore/FreeSql](https://github.com/dotnetcore/FreeSql)
- Gitee [https://gitee.com/FreeSql/FreeSql-ORM](https://gitee.com/FreeSql/FreeSql-ORM)

## 官方文档

- [https://freesql.net](https://freesql.net)
- [https://github.com/dotnetcore/FreeSql/wiki](https://github.com/dotnetcore/FreeSql/wiki)
- [API参考 (国内镜像)](http://124.221.134.143:8082/api/index.html)
- [API参考](https://dotnetcore.github.io/FreeSql/index.html)
