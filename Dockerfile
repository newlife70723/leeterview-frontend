# 使用 Node.js 官方映像檔
FROM node:18-alpine AS base

# 設定工作目錄
WORKDIR /app

# 只複製 package.json 和 package-lock.json，安裝依賴
COPY package*.json ./
RUN npm install --legacy-peer-deps

# 複製全部檔案
COPY . .

# 建置專案
RUN npm run build

# 使用更輕量的鏡像來運行應用
FROM node:18-alpine AS production

# 設定工作目錄
WORKDIR /app

# 複製 build 和所需的依賴
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/.next ./.next
COPY --from=base /app/package*.json ./

# 啟動 Next.js 伺服器
CMD ["npm", "run", "start"]
