FROM node:12.15.0-alpine as builder
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PORT 80
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
COPY .npmrc /usr/src/app/.npmrc

RUN rm -rf node_modules yarn.lock yarn-error.log
RUN rm -rf node_modules yarn.lock yarn-error.log

RUN yarn install
RUN ls -la
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN ls /usr/src
ARG version
RUN echo "version: $version"
RUN version=$version yarn build

#upload resource to cdn with swiftstackuploader application
FROM registry.hepsiburada.com/cst-swiftstackuploader:1 AS swiftstackuploader
ARG version
RUN echo "Version: $version"
ARG swiftUserName
RUN echo "swift user name:$swiftUserName"
ARG swiftpass
RUN echo "swift password:$swiftpass"
COPY --from=builder /usr/src/app/dist /cdnfiles
WORKDIR /cdnfiles/assets
WORKDIR /cdnfiles
RUN ls
WORKDIR /swiftstackuploader.application
RUN ls
RUN dotnet SwiftStackUploader.dll --pathToUpload /cdnfiles/ --applicationName solutioncenter --version $version --swiftUserName $swiftUserName --swiftpass $swiftpass

# production environment
FROM nginx:1.14
RUN rm -rf /etc/nginx/conf.d
COPY utils/docker/nginx /etc/nginx
COPY configs/ /usr/share/nginx/configs
COPY utils/docker/docker-entrypoint.sh /usr/share/nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
WORKDIR /usr/share/nginx
ARG NODE_ENV
RUN ls -la
RUN chmod +x docker-entrypoint.sh
RUN NODE_ENV=$NODE_ENV
CMD ["./docker-entrypoint.sh"]
