# Cloudflare Pages 环境变量设置指南

## ⚠️ 重要：必须设置环境变量才能启用登录认证

从你的日志看到：
```
Auth check response: {authEnabled: false, authenticated: true, message: 'Authentication not configured'}
```

这说明 **还没有设置认证环境变量**，所以登录功能未启用。

---

## 📋 设置步骤

### 步骤 1：登录 Cloudflare Dashboard

访问：https://dash.cloudflare.com

### 步骤 2：进入 Pages 项目

1. 左侧菜单点击 **Pages**
2. 选择你的项目（如 `images-20180621`）

### 步骤 3：打开环境变量设置

1. 点击顶部 **设置** 标签
2. 滚动到 **环境变量** 部分
3. 点击 **添加环境变量**

### 步骤 4：添加环境变量

添加以下 4 个变量：

| 变量名 | 值 | 说明 | 是否必须 |
|--------|-----|------|---------|
| `AUTH_USERNAME` | `admin` | 登录用户名 | ✅ 启用认证必须 |
| `AUTH_PASSWORD` | `你的强密码` | 登录密码 | ✅ 启用认证必须 |
| `TG_Bot_Token` | `123456:AAxxxGKrn5` | Telegram Bot Token | ✅ 上传功能必须 |
| `TG_Chat_ID` | `-1234567` | Telegram Channel ID | ✅ 上传功能必须 |

#### 环境变量详细说明

##### 1. AUTH_USERNAME（登录用户名）
- **示例值**: `admin`
- **说明**: 用于登录的用户名
- **建议**: 不要使用过于简单的用户名

##### 2. AUTH_PASSWORD（登录密码）
- **示例值**: `MySecureP@ssw0rd2024`
- **说明**: 用于登录的密码
- **建议**: 
  - 至少 8 位
  - 包含大小写字母
  - 包含数字和特殊字符

##### 3. TG_Bot_Token（Telegram Bot Token）
- **获取方式**: 
  1. 在 Telegram 搜索 `@BotFather`
  2. 发送 `/newbot`
  3. 按提示创建机器人
  4. 复制收到的 Token
- **格式**: `123456:AAxxxGKrn5`

##### 4. TG_Chat_ID（Telegram Channel ID）
- **获取方式**:
  1. 创建一个 Channel（频道）
  2. 添加你的机器人为管理员
  3. 发送一条消息到频道
  4. 使用 `@GetTheirIDBot` 获取频道 ID
- **格式**: `-1234567`（注意负号）

### 步骤 5：保存并重新部署

1. 点击 **保存** 按钮
2. 进入 **部署** 标签
3. 找到最新的部署
4. 点击右侧 **⋮** 菜单
5. 选择 **重试部署**

---

## ✅ 验证设置是否成功

### 方法 1：查看控制台日志

部署完成后，访问你的网站，打开浏览器控制台（F12）：

**成功启用认证**：
```
Auth check response: {authEnabled: true, authenticated: false, message: 'Authentication required'}
```

**未启用认证**：
```
Auth check response: {authEnabled: false, authenticated: true, message: 'Authentication not configured'}
```

### 方法 2：测试登录功能

1. **清除浏览器 Cookie**
   - Chrome: 设置 → 隐私和安全 → 清除浏览数据
   - 或按 `Ctrl + Shift + Del`

2. **刷新页面**
   - 应该看到登录界面

3. **输入用户名密码**
   - 使用你设置的 `AUTH_USERNAME` 和 `AUTH_PASSWORD`

4. **登录成功**
   - 登录界面消失
   - 显示上传界面

### 方法 3：测试上传保护

1. **清除 Cookie**
2. **尝试直接上传图片**
3. **应该返回 401 错误**
   ```json
   {"success":false,"error":"Unauthorized","message":"请先登录"}
   ```

---

## 🔧 常见问题

### Q1: 设置了环境变量但还是显示 authEnabled: false

**原因**: Cloudflare Pages 未重新部署

**解决**:
1. 进入 **部署** 页面
2. 点击 **重试部署**
3. 等待部署完成（约 1-2 分钟）
4. 清除浏览器缓存后刷新

### Q2: 登录后立即被踢出

**原因**: Cookie 设置问题或 Session 过期

**解决**:
1. 检查浏览器是否允许 Cookie
2. 清除 Cookie 重新登录
3. 检查服务器时间是否准确

### Q3: 上传图片失败

**原因**: 可能缺少 Telegram 相关环境变量

**解决**:
1. 检查 `TG_Bot_Token` 是否正确
2. 检查 `TG_Chat_ID` 是否正确（注意负号）
3. 确认机器人是 Channel 管理员

### Q4: 如何修改密码？

**方法**:
1. 进入 Cloudflare Pages → 设置 → 环境变量
2. 修改 `AUTH_PASSWORD` 的值
3. 点击 **保存**
4. **重试部署**
5. 使用新密码登录

---

## 🚀 快速设置清单

- [ ] 登录 Cloudflare Dashboard
- [ ] 进入 Pages 项目
- [ ] 打开环境变量设置
- [ ] 添加 `AUTH_USERNAME`
- [ ] 添加 `AUTH_PASSWORD`
- [ ] 添加 `TG_Bot_Token`
- [ ] 添加 `TG_Chat_ID`
- [ ] 保存设置
- [ ] 重试部署
- [ ] 等待部署完成
- [ ] 清除浏览器 Cookie
- [ ] 测试登录功能
- [ ] 测试上传功能

---

## 📞 需要帮助？

如果还有问题，请提供：
1. Cloudflare Pages 的部署日志
2. 浏览器控制台的完整日志
3. 环境变量的截图（隐藏敏感信息）

---

**设置完成后，登录认证功能就会生效！** 🔐
