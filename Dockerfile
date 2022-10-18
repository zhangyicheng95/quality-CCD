

FROM ai-harbor.sany.com.cn/component/nginx:latest

LABEL maintainer="wangdf6@sany.com.cn"

COPY dist  /webapp

RUN chmod 777 -R /webapp && chown nginx:nginx -R /webapp

COPY conf/nginx.conf /etc/nginx/nginx.conf


