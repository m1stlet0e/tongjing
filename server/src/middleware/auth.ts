import { type Request, type Response, type NextFunction } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

// 扩展 Request 类型，添加 userId 属性
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: any;
    }
  }
}

/**
 * 认证中间件 - 验证 Token 并提取用户 ID
 * 
 * 从 Authorization 头部提取 Bearer Token
 * 验证 token 是否有效且未过期
 * 将 user_id 注入到 req.userId 和 req.user
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: '请先登录',
        code: 'UNAUTHORIZED' 
      });
    }

    const client = getSupabaseClient();

    // 验证 token 并获取用户信息
    const { data: session, error } = await client
      .from('user_sessions')
      .select(`
        *,
        users (*)
      `)
      .eq('token', token)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error || !session) {
      return res.status(401).json({ 
        success: false, 
        error: '登录已过期，请重新登录',
        code: 'TOKEN_EXPIRED' 
      });
    }

    // 注入用户信息到请求对象
    req.userId = session.user_id;
    req.user = session.users;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      error: '认证失败' 
    });
  }
};

/**
 * 可选认证中间件 - 如果提供了 token 则验证，否则继续
 * 用于同时支持登录和未登录用户的接口
 */
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      const client = getSupabaseClient();
      const { data: session } = await client
        .from('user_sessions')
        .select(`
          *,
          users (*)
        `)
        .eq('token', token)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (session) {
        req.userId = session.user_id;
        req.user = session.users;
      }
    }

    next();
  } catch (error) {
    // 可选认证失败不影响继续
    next();
  }
};
