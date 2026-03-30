/**
 * 全局中间件 - 认证拦截
 * 检查用户是否已登录，未登录则返回 401
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
  
  if (authCookie) {
    try {
      const sessionData = atob(authCookie.split('=')[1]);
      const session = JSON.parse(sessionData);
      
      // 检查 session 是否有效（24 小时内）
      if (session.authenticated && (Date.now() - session.timestamp) < 86400000) {
        // 已认证，放行
        return await context.next();
      }
    } catch (e) {
      console.error('Session parse error:', e);
    }
  }
  
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

export const onRequest = [authCheck];
