# 登录认证功能设置指南

## 功能说明

本项目已添加登录认证功能，访问网站时需要先登录才能使用图片上传功能。

## 部署步骤

### 1. 推送到 GitHub

代码已推送到：https://github.com/andy--chen/Telegraph-Image

Cloudflare Pages 会自动检测并部署。

### 2. 配置环境变量

在 Cloudflare Pages 后台设置以下环境变量：

| 变量名 | 示例值 | 说明 |
|--------|--------|------|
| `AUTH_USERNAME` | `admin` | 登录用户名 |
| `AUTH_PASSWORD` | `your_password` | 登录密码 |
| `TG_Bot_Token` | `123456:AAxxxGKrn5` | Telegram Bot Token |
| `TG_Chat_ID` | `-1234567` | Telegram Chat ID |

### 3. 设置环境变量步骤

1. 登录 Cloudflare Dashboard
2. 进入 Pages → 选择你的项目
3. 点击 **设置** → **环境变量**
4. 点击 **添加环境变量**
5. 添加上述变量
6. 点击 **保存**

### 4. 重新部署

环境变量修改后，需要重新部署才能生效：

1. 进入 **部署** 页面
2. 找到最新的部署
3. 点击 **重试部署**
4. 或者进入 **设置** → **构建和测试** → **重试部署**

---

## 功能说明

### 启用认证
- 设置了 `AUTH_USERNAME` 和 `AUTH_PASSWORD` 后，访问网站会显示登录界面
- 输入正确的用户名密码后才能使用上传功能

### 禁用认证
- 不设置 `AUTH_USERNAME` 和 `AUTH_PASSWORD`
- 或者删除这两个环境变量
- 网站将直接显示，无需登录

### Session 管理
- 登录成功后创建 24 小时的 session cookie
- 24 小时后需要重新登录
- 清除浏览器 Cookie 会退出登录

---

## 技术实现

### Cloudflare Pages Functions

认证功能使用 Cloudflare Pages Functions 实现：

```
/functions/auth.js  - 处理 GET/POST 请求
  GET  /auth - 检查认证状态
  POST /auth - 处理登录请求
```

### 前端代码

```html
/index.html
  - 登录覆盖层（默认显示）
  - 自动检查认证状态
  - 登录成功后隐藏覆盖层
```

---

## 故障排除

### 问题：显示 405 Method Not Allowed

**原因**：Cloudflare Pages Functions 未正确部署

**解决**：
1. 检查 `/functions/auth.js` 是否存在
2. 重新部署项目
3. 清除浏览器缓存

### 问题：登录后仍然显示登录界面

**原因**：Cookie 未正确设置或已过期

**解决**：
1. 清除浏览器 Cookie
2. 重新登录
3. 检查浏览器是否允许 Cookie

### 问题：认证端点返回 404

**原因**：Cloudflare Pages 未识别 Functions

**解决**：
1. 确保 `functions` 目录在仓库根目录
2. 检查文件名是否正确（`auth.js`）
3. 重新部署

---

## 安全建议

1. **使用强密码**：至少 8 位，包含大小写字母和数字
2. **定期更换密码**：建议每 3 个月更换一次
3. **使用 HTTPS**：Cloudflare Pages 默认启用 HTTPS
4. **不要分享凭证**：避免多人使用同一账号

---

## 常见问题

### Q: 可以添加多个用户吗？

A: 当前版本只支持单用户。如需多用户，需要修改 `/functions/auth.js`。

### Q: 如何修改密码？

A: 在 Cloudflare Pages 后台修改 `AUTH_PASSWORD` 环境变量，然后重新部署。

### Q: Session 可以自定义时长吗？

A: 可以。修改 `/functions/auth.js` 中的 `Max-Age` 值（单位：秒）。

### Q: 会影响图片上传功能吗？

A: 不会。认证只是在上传前添加登录步骤，上传功能完全保留。

---

## 技术支持

如有问题，请提交 Issue 到：
https://github.com/cf-pages/Telegraph-Image/issues
