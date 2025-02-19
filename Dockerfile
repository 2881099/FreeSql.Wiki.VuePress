# node 构建
FROM node:22-alpine as build-stage

ENV WORKDIR=/app

WORKDIR $WORKDIR

COPY ./ $WORKDIR/

# 设置 node 阿里镜像
RUN npm config set registry https://registry.npmmirror.com

RUN corepack enable
RUN pnpm install
RUN pnpm docs:build
RUN echo "🎉 编 🎉 译 🎉 成 🎉 功 🎉"

# nginx 部署
FROM nginx:alpine as prod

RUN mkdir /app

COPY --from=build-stage /app/docs/.vuepress/dist /usr/share/nginx/html
COPY --from=build-stage /app/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
RUN echo "🎉 架 🎉 设 🎉 成 🎉 功 🎉"
