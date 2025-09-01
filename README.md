# 体育之家 - Sports Team Management Platform

一个现代化的体育新闻和球队管理平台，参考虎扑NBA网站设计，提供体育新闻浏览、创建球队、邀请成员、上传媒体文件等功能。

## ✨ 功能特性

### 🏀 核心功能
- **体育新闻** - 浏览最新体育资讯，支持分类筛选
- **球队管理** - 创建和管理你的球队
- **成员邀请** - 邀请其他用户加入球队
- **媒体上传** - 上传图片和视频，支持无限制文件大小
- **用户认证** - 安全的用户注册和登录系统

### 🎨 UI特色
- 响应式设计，完美适配移动端
- 参考虎扑NBA的设计风格
- 流畅的动画效果
- 现代化的卡片式布局

### 🔧 技术栈
- **前端**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **后端**: Next.js API Routes, NextAuth.js
- **数据库**: MongoDB, Mongoose
- **文件存储**: Cloudinary
- **部署**: 支持 Vercel 部署

## 🚀 快速开始

### 环境要求
- Node.js 18+
- MongoDB
- Cloudinary 账户

### 安装步骤

1. **安装依赖**
   ```bash
   npm install
   ```

2. **环境变量配置**
   创建 `.env.local` 文件：
   ```env
   MONGODB_URI=mongodb://localhost:27017/sports-team-website
   NEXTAUTH_SECRET=your-nextauth-secret-key
   NEXTAUTH_URL=http://localhost:3000
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

4. **访问应用**
   打开 [http://localhost:3000](http://localhost:3000)

## 📚 项目结构

```
app/
├── api/                 # API 路由
│   ├── auth/           # 认证相关
│   ├── teams/          # 球队管理
│   ├── news/           # 新闻管理
│   └── upload/         # 文件上传
├── components/         # 可复用组件
├── lib/               # 工具库
│   ├── models/        # 数据模型
│   ├── db.ts          # 数据库连接
│   └── cloudinary.ts  # 文件存储
├── auth/              # 认证页面
├── teams/             # 球队相关页面
├── news/              # 新闻页面
├── upload/            # 上传页面
└── globals.css        # 全局样式
```

## 🎯 主要页面

- **首页** (`/`) - 展示新闻列表和热门球队
- **体育新闻** (`/news`) - 新闻浏览和分类筛选
- **球队管理** (`/teams`) - 查看和管理球队
- **创建球队** (`/teams/create`) - 创建新球队
- **文件上传** (`/upload`) - 上传图片和视频
- **用户认证** (`/auth/*`) - 登录和注册

## 🔐 用户权限

- **游客**: 浏览新闻和公开球队信息
- **注册用户**: 创建球队、加入球队、上传文件
- **球队队长**: 邀请成员、管理球队设置
- **球队管理员**: 协助管理球队成员

## 📱 移动端支持

网站采用响应式设计，完美支持：
- 📱 手机端 (320px+)
- 💻 平板端 (768px+)
- 🖥️ 桌面端 (1024px+)

## 🌟 特色功能

### 无限制文件上传
- 支持任意大小的图片和视频文件
- 基于 Cloudinary 的云存储
- 自动压缩和格式优化
- 上传进度显示

### 球队邀请系统
- 通过邮箱邀请新成员
- 邀请状态跟踪
- 权限管理（队长/管理员/队员）

### 虎扑风格UI
- 橙色主色调
- 卡片式布局
- 流畅的过渡动画
- 现代化的交互体验

## 🛠️ 开发命令

```bash
# 开发模式
npm run dev

# 构建项目
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系我们

如有问题，请通过 GitHub Issues 联系。