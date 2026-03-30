/**
 * 全局中间件 - 认证拦截
 * 检查用户是否已登录，未登录则返回 401（仅 API 接口）
 */

async function authCheck(context) {
  const { request, env } = context;
  
  // 检查是否启用了认证
  const authEnabled = !!(env.AUTH_USERNAME && env.AUTH_PASSWORD);
  
  if (!authEnabled) {
    // 未启用认证，直接放行
    return await context.next();
  }
  
  // 获取 Cookie
  const cookie = request.headers.get('Cookie') || '';
  const authCookie = cookie.split(';').find(c => c.trim().startsWith('auth_session='));
  
  let isAuthenticated = false;
  
  if (authCookie) {
    try {
      const sessionData = atob(authCookie.split('=')[1]);
      const session = JSON.parse(sessionData);
      
      // 检查 session 是否有效（24 小时内）
      if (session.authenticated && (Date.now() - session.timestamp) < 86400000) {
        isAuthenticated = true;
      }
    } catch (e) {
      console.error('Session parse error:', e);
    }
  }
  
  // 获取请求路径
  const url = new URL(request.url);
  const path = url.pathname;
  
  // 只拦截 API 接口，不拦截 HTML 页面
  // 允许公开访问：首页、认证接口、文件访问
  const publicPaths = ['/', '/auth', '/file'];
  const isPublicPath = publicPaths.some(p => path.startsWith(p));
  
  if (isPublicPath) {
    // 公开路径，直接放行
    return await context.next();
  }
  
  // 检查是否是 API 请求
  const isApiRequest = path.startsWith('/api') || path.startsWith('/upload');
  
  if (!isApiRequest) {
    // 非 API 请求，直接放行
    return await context.next();
  }
  
  // API 请求需要认证
  if (!isAuthenticated) {
    // 未认证，返回 401
    return new Response(JSON.stringify({
      success: false,
      error: 'Unauthorized',
      message: '请先登录'
    }), {
      status: 401,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }
  
  // 已认证，放行
  return await context.next();
}

export const onRequest = [authCheck];
