# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Final Stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# ビルドしたフロントエンド資産とサーバーコードをコピー
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
# tsx を使用して TypeScript のサーバーを実行するため devDependencies の一部が必要ですが、
# ここではシンプルに tsx を production に含めるか、ビルドするか検討します。
# 軽量化のため、tsx をグローバルにインストールするか、ビルドステージでJSに変換するのが一般的です。

RUN npm install -g tsx

EXPOSE 8080

CMD ["tsx", "server/index.ts"]
