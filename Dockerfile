# 使用 Node.js 官方映像檔
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 安裝相依套件
COPY package*.json ./
RUN npm install

# 複製全部檔案
COPY . .

# 建置專案
RUN npm run build

# 啟動 Next.js 伺服器
CMD ["npm", "run", "start"]

