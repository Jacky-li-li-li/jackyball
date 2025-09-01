# 微信扫码登录配置指南

## 🔧 微信开放平台配置

### 1. 申请微信开放平台账号
1. 访问 [微信开放平台](https://open.weixin.qq.com/)
2. 注册并认证开发者账号
3. 创建网站应用

### 2. 获取应用信息
完成应用创建后，你将获得：
- `AppID` - 应用唯一标识
- `AppSecret` - 应用密钥

### 3. 配置授权回调域
在微信开放平台的应用管理中设置：
- 授权回调域：`yourdomain.com` (不包含http://)
- 开发环境：`localhost:3000`

## ⚙️ 项目配置

### 1. 环境变量设置
在 `.env.local` 文件中添加：

```env
# WeChat OAuth Configuration
WECHAT_APP_ID=your_actual_wechat_app_id
WECHAT_APP_SECRET=your_actual_wechat_app_secret
WECHAT_REDIRECT_URI=http://localhost:3000/api/auth/callback/wechat

# 生产环境使用
# WECHAT_REDIRECT_URI=https://yourdomain.com/api/auth/callback/wechat
```

### 2. NextAuth配置
项目已经配置了微信OAuth提供商，支持：
- 微信扫码登录
- 自动用户注册
- 用户信息同步

## 🚀 功能特性

### 用户体验
- **扫码登录**：显示微信二维码，用户扫码即可登录
- **自动注册**：首次登录自动创建用户账户
- **信息同步**：同步微信头像和昵称
- **跨设备**：支持PC和移动端

### 安全特性
- OAuth 2.0 标准认证流程
- JWT Token 会话管理
- 用户信息加密存储
- CSRF 防护

## 📱 登录流程

1. **用户点击登录** → 显示微信二维码
2. **扫码授权** → 微信确认登录
3. **回调处理** → 服务器处理用户信息
4. **账户创建/更新** → 自动同步用户数据
5. **登录完成** → 跳转到首页

## 🔍 测试步骤

### 开发环境测试
1. 确保环境变量配置正确
2. 启动开发服务器：`npm run dev`
3. 访问：http://localhost:3000/auth/signin
4. 使用微信扫描二维码测试

### 生产环境部署
1. 更新 `WECHAT_REDIRECT_URI` 为生产域名
2. 在微信开放平台添加生产域名
3. 部署并测试完整流程

## ⚠️ 注意事项

### 开发注意
- 微信二维码有效期为2分钟
- 需要真实的微信开放平台应用
- 本地开发需要内网穿透或公网域名
- 测试账号需要是微信开放平台的测试用户

### 生产部署
- 确保HTTPS协议
- 配置正确的回调域名
- 定期更新AppSecret
- 监控登录成功率

## 🛠️ 故障排除

### 常见问题
1. **二维码不显示**：检查WECHAT_APP_ID配置
2. **扫码后无响应**：验证回调URI配置
3. **登录失败**：查看服务器日志错误信息
4. **用户信息不同步**：检查数据库连接

### 调试建议
- 查看浏览器开发者工具Network面板
- 检查服务器日志中的OAuth回调
- 验证数据库用户记录创建情况
- 测试微信OAuth接口响应

## 📞 技术支持

如遇到配置问题，可以：
1. 查看微信开放平台文档
2. 检查NextAuth.js官方文档
3. 查看项目GitHub Issues
4. 联系技术支持团队