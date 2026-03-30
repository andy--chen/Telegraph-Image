/**
 * 认证 API - 处理用户登录认证
 * 使用环境变量 AUTH_USERNAME 和 AUTH_PASSWORD
 */

export async function onRequestPost(context) {
  const { request, env } = context;
  
  // 检查是否启用了认证
  const authEnabled = !!(env.AUTH_USERNAME && env.AUTH_PASSWORD);
  
  if (!authEnabled) {
    return new Response(JSON.stringify({
      authEnabled: false,
      authenticated: true,
      message: 'Authentication not configured'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { username, password } = await request.json();
    
    // 验证用户名密码
    if (username === env.AUTH_USERNAME && password === env.AUTH_PASSWORD) {
      // 创建简单的 session cookie
      const sessionData = {
        authenticated: true,
        timestamp: Date.now()
      };
      
      const cookieValue = btoa(JSON.stringify(sessionData));
      
      return new Response(JSON.stringify({
        authEnabled: true,
        authenticated: true,
        success: true,
        message: 'Authentication successful'
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `auth_session=${cookieValue}; Path=/; Max-Age=86400; SameSite=Lax`
        }
      });
    } else {
      return new Response(JSON.stringify({
        authEnabled: true,
        authenticated: false,
        success: false,
        message: 'Invalid username or password'
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      authEnabled: true,
      authenticated: false,
      success: false,
      message: error.message
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  
  // 检查是否启用了认证
  const authEnabled = !!(env.AUTH_USERNAME && env.AUTH_PASSWORD);
  
  if (!authEnabled) {
    return new Response(JSON.stringify({
      authEnabled: false,
      authenticated: true,
      message: 'Authentication not configured'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // 检查 cookie
  const cookie = request.headers.get('Cookie') || '';
  const authCookie = cookie.split(';').find(c => c.trim().startsWith('auth_session='));
  
  if (authCookie) {
    try {
      const sessionData = atob(authCookie.split('=')[1]);
      const session = JSON.parse(sessionData);
      
      // 检查 session 是否过期（24 小时）
      if (session.authenticated && (Date.now() - session.timestamp) < 86400000) {
        return new Response(JSON.stringify({
          authEnabled: true,
          authenticated: true,
          message: 'Already authenticated'
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (e) {
      console.error('Session parse error:', e);
    }
  }
  
  return new Response(JSON.stringify({
    authEnabled: true,
    authenticated: false,
    message: 'Authentication required'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
