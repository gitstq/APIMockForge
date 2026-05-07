<div align="center">

# 🚀 APIMockForge

**智能API模拟与测试平台**

[![GitHub stars](https://img.shields.io/github/stars/gitstq/APIMockForge?style=for-the-badge&color=yellow)](https://github.com/gitstq/APIMockForge/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/gitstq/APIMockForge?style=for-the-badge&color=blue)](https://github.com/gitstq/APIMockForge/network)
[![License](https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen?style=for-the-badge&logo=node.js)](https://nodejs.org/)

[English](#english) | [简体中文](#简体中文) | [繁體中文](#繁體中文)

</div>

---

## 简体中文

### 🎉 项目介绍

**APIMockForge** 是一个现代化的智能API模拟与测试平台，专为前后端分离开发场景设计。它不仅能快速创建Mock API，还集成了AI智能数据生成、团队协作、OpenAPI规范导入导出等高级功能。

**灵感来源**：在日常开发中，我们经常遇到后端API未就绪、第三方服务不稳定、测试数据难以构造等问题。APIMockForge旨在解决这些痛点，让开发者能够专注于前端开发，而不被API依赖所阻塞。

**自研差异化亮点**：
- 🤖 **AI智能Mock**：基于LLM自动生成符合上下文的模拟数据
- 👥 **实时协作**：WebSocket驱动的团队实时同步编辑
- 📊 **性能模拟**：支持延迟、错误率、限流等混沌工程测试
- 🔌 **OpenAPI生态**：完整的Swagger/OpenAPI导入导出支持

### ✨ 核心特性

| 特性 | 描述 | 状态 |
|------|------|------|
| 🎨 **现代化UI** | 基于React 18 + Tailwind CSS的精美界面 | ✅ |
| ⚡ **高性能** | Vite构建，极速开发体验 | ✅ |
| 🗄️ **本地存储** | SQLite零配置数据库，数据安全可控 | ✅ |
| 🔄 **实时同步** | Socket.io实现团队协作 | ✅ |
| 🤖 **AI生成** | OpenAI/Claude API集成智能数据生成 | ✅ |
| 📱 **响应式** | 完美适配桌面和移动设备 | ✅ |
| 🌐 **多语言** | 支持中/英/繁等多语言界面 | 🚧 |
| 🔐 **权限管理** | 细粒度的团队角色权限控制 | ✅ |

### 🚀 快速开始

#### 环境要求

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 或 **pnpm** >= 8.0.0

#### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/gitstq/APIMockForge.git
cd APIMockForge

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

#### 访问应用

- 🌐 **前端界面**：http://localhost:3000
- 🔌 **Mock服务**：http://localhost:3001/mock
- 📡 **API文档**：http://localhost:3001/api/health

### 📖 详细使用指南

#### 1. 创建Mock接口

1. 进入"Mock编辑器"页面
2. 点击"新建接口"按钮
3. 配置请求方法、路径、响应数据
4. 点击保存，接口立即生效

#### 2. 导入OpenAPI规范

1. 切换到"API文档"标签
2. 粘贴OpenAPI 3.0 JSON或上传文件
3. 系统自动解析并生成Mock接口

#### 3. 团队协作

1. 邀请成员加入项目
2. 设置角色权限（所有者/管理员/编辑者/查看者）
3. 实时同步编辑，冲突自动解决

#### 4. AI智能生成

1. 在接口高级设置中启用AI
2. 配置OpenAI API密钥
3. 输入接口描述，AI自动生成Mock数据

### 💡 设计思路与迭代规划

**技术选型原因**：
- **React 18**：并发特性和更好的性能
- **TypeScript**：类型安全，提升开发体验
- **SQLite**：零配置，适合桌面应用
- **Express**：成熟稳定，生态丰富

**后续功能迭代计划**：
- [ ] v1.1.0：请求记录与回放功能
- [ ] v1.2.0：环境变量与动态响应
- [ ] v1.3.0：GraphQL Mock支持
- [ ] v2.0.0：云端同步与多设备协作

**社区贡献方向**：
- 插件系统开发
- 更多AI提供商支持
- 高级性能测试功能

### 📦 打包与部署指南

#### 开发模式

```bash
npm run dev
```

#### 生产构建

```bash
npm run build
npm start
```

#### Docker部署

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000 3001
CMD ["npm", "start"]
```

### 🤝 贡献指南

欢迎提交Issue和PR！请遵循以下规范：

1. **Issue**：清晰描述问题和复现步骤
2. **PR**：
   - 遵循Angular提交规范
   - 添加必要的测试用例
   - 更新相关文档

### 📄 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

---

## 繁體中文

### 🎉 專案介紹

**APIMockForge** 是一個現代化的智慧API模擬與測試平台，專為前後端分離開發場景設計。它不僅能快速建立Mock API，還整合了AI智慧資料生成、團隊協作、OpenAPI規範匯入匯出等進階功能。

### ✨ 核心特性

- 🤖 **AI智慧Mock**：基於LLM自動生成符合上下文的模擬資料
- 👥 **即時協作**：WebSocket驅動的團隊即時同步編輯
- 📊 **效能模擬**：支援延遲、錯誤率、限流等混沌工程測試
- 🔌 **OpenAPI生態**：完整的Swagger/OpenAPI匯入匯出支援

### 🚀 快速開始

```bash
git clone https://github.com/gitstq/APIMockForge.git
cd APIMockForge
npm install
npm run dev
```

### 📄 開源協議

[MIT License](LICENSE)

---

## English

### 🎉 Introduction

**APIMockForge** is a modern intelligent API mocking and testing platform designed for frontend-backend separated development scenarios. It not only enables rapid Mock API creation but also integrates advanced features like AI-powered data generation, team collaboration, and OpenAPI specification import/export.

### ✨ Key Features

- 🤖 **AI-Powered Mocking**: LLM-based contextual mock data generation
- 👥 **Real-time Collaboration**: WebSocket-driven team synchronization
- 📊 **Performance Simulation**: Chaos engineering testing with latency, error rates, and rate limiting
- 🔌 **OpenAPI Ecosystem**: Full Swagger/OpenAPI import and export support

### 🚀 Quick Start

```bash
git clone https://github.com/gitstq/APIMockForge.git
cd APIMockForge
npm install
npm run dev
```

### 📄 License

[MIT License](LICENSE)

---

<div align="center">

Made with ❤️ by **gitstq**

⭐ Star us on GitHub — it motivates us a lot!

</div>
