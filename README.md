# Leeterview - Frontend (Next.js)

Leeterview is a platform for sharing LeetCode solutions and insights. The frontend is built with **Next.js** and **TypeScript**, providing an interactive user interface.

## 📦 Tech Stack
- **Framework**: Next.js (React + TypeScript)  
- **Styling**: Tailwind CSS (if applicable)  
- **Containerization**: Docker  
- **Deployment**: AWS ECS

## 🔧 Environment Requirements
- Node.js 18.x  
- npm/yarn  
- Docker (optional)

## 🚀 Installation & Running

1. Install dependencies: 
   ```bash
   npm install

## Start the development server:
    npm run dev

## 🐳 docker execute
    docker build -t leeterview-frontend .
    docker run -p 3000:3000 leeterview-frontend

## 🏷️ Git Branch Policy

### **`main`**  
- **Production** branch with the latest **stable** and **deployable** version.  
- Only merged from `develop` after testing.

### **`develop`**  
- **Development** branch for integrating **completed features**.  
- Regularly merged into `main` for releases.

### **`feature/*`**  
- For **new feature development**.  
- Created from `develop` and merged back when done.