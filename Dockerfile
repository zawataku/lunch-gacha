# --- Build Stage ---
FROM node:lts-alpine AS builder
WORKDIR /app

# 依存関係をインストール
COPY package*.json ./
RUN npm ci

# 全ファイルをコピーしてビルドを実行
COPY . .
RUN npm run build

# --- Production Stage ---
FROM node:lts-alpine
WORKDIR /app

ENV NODE_ENV=production

# 本番用の依存関係のみインストール
COPY package*.json ./
RUN npm ci --omit=dev

# ビルド済みファイルとサーバーコードをコピー
COPY --from=builder /app/dist ./dist
COPY server ./server

# サーバー実行用に tsx をインストール
RUN npm install -g tsx

EXPOSE 8080

# サーバを起動
CMD ["tsx", "server/index.ts"]
