import { Router, type Request, type Response } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';
import crypto from 'crypto';

const router = Router();

// 生成随机token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 生成6位验证码
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Token过期时间（7天）
const TOKEN_EXPIRE_DAYS = 7;

/**
 * POST /api/v1/auth/send-code
 * 发送短信验证码
 * Body: phone, type(login/register)
 */
router.post('/send-code', async (req: Request, res: Response) => {
  try {
    const { phone, type = 'login' } = req.body;
    const client = getSupabaseClient();

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, error: '请输入正确的手机号' });
    }

    // 检查发送频率（1分钟内只能发一次）
    const { data: recentCodes } = await client
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('type', type)
      .gte('created_at', new Date(Date.now() - 60000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentCodes && recentCodes.length > 0) {
      return res.status(429).json({ success: false, error: '验证码发送太频繁，请1分钟后再试' });
    }

    // 生成验证码
    const code = generateCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5分钟后过期

    // 保存验证码
    const { error } = await client
      .from('verification_codes')
      .insert({
        phone,
        code,
        type,
        expires_at: expiresAt.toISOString(),
      });

    if (error) throw error;

    // TODO: 实际项目中这里调用短信服务发送验证码
    // 这里为了演示，直接返回验证码（生产环境必须删除）
    console.log(`[SMS] 发送验证码到 ${phone}: ${code}`);

    res.json({
      success: true,
      message: '验证码已发送',
      // 开发环境返回验证码，生产环境删除
      _dev_code: process.env.NODE_ENV !== 'production' ? code : undefined,
    });
  } catch (error) {
    console.error('Error sending code:', error);
    res.status(500).json({ success: false, error: '发送验证码失败' });
  }
});

/**
 * POST /api/v1/auth/login/phone
 * 手机号验证码登录
 * Body: phone, code
 */
router.post('/login/phone', async (req: Request, res: Response) => {
  try {
    const { phone, code } = req.body;
    const client = getSupabaseClient();

    if (!phone || !code) {
      return res.status(400).json({ success: false, error: '请输入手机号和验证码' });
    }

    // 验证验证码
    const { data: codeRecord, error: codeError } = await client
      .from('verification_codes')
      .select('*')
      .eq('phone', phone)
      .eq('code', code)
      .eq('type', 'login')
      .eq('used', false)
      .gte('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (codeError || !codeRecord) {
      return res.status(400).json({ success: false, error: '验证码错误或已过期' });
    }

    // 标记验证码已使用
    await client
      .from('verification_codes')
      .update({ used: true })
      .eq('id', codeRecord.id);

    // 查找或创建用户
    let { data: user } = await client
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single();

    if (!user) {
      // 自动注册新用户
      const username = `用户${phone.slice(-4)}`;
      const { data: newUser, error: createError } = await client
        .from('users')
        .insert({
          phone,
          username,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=002FA7&color=fff`,
        })
        .select()
        .single();

      if (createError) throw createError;
      user = newUser;
    }

    // 创建登录会话
    const token = generateToken();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000);

    await client.from('user_sessions').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      device_info: { user_agent: req.headers['user-agent'] },
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          phone: user.phone,
          avatar_url: user.avatar_url,
          bio: user.bio,
        },
        token,
        expires_at: expiresAt.toISOString(),
      },
      message: '登录成功',
    });
  } catch (error) {
    console.error('Error phone login:', error);
    res.status(500).json({ success: false, error: '登录失败' });
  }
});

/**
 * POST /api/v1/auth/login/oauth
 * 第三方登录（微信、微博）
 * Body: provider(wechat/weibo), code, state
 */
router.post('/login/oauth', async (req: Request, res: Response) => {
  try {
    const { provider, code: authCode, state } = req.body;
    const client = getSupabaseClient();

    if (!provider || !authCode) {
      return res.status(400).json({ success: false, error: '参数错误' });
    }

    if (!['wechat', 'weibo'].includes(provider)) {
      return res.status(400).json({ success: false, error: '不支持的登录方式' });
    }

    // TODO: 实际项目中需要调用对应平台的API获取用户信息
    // 这里模拟第三方登录流程
    let providerUserId: string;
    let providerData: any = {};

    if (provider === 'wechat') {
      // 模拟微信登录
      providerUserId = `wechat_${Date.now()}`;
      providerData = {
        nickname: '微信用户',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      };
    } else if (provider === 'weibo') {
      // 模拟微博登录
      providerUserId = `weibo_${Date.now()}`;
      providerData = {
        nickname: '微博用户',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=400&h=400&fit=crop',
      };
    } else {
      return res.status(400).json({ success: false, error: '不支持的登录方式' });
    }

    // 查找是否已绑定账号
    const { data: existingOAuth } = await client
      .from('user_oauth_providers')
      .select('*, users(*)')
      .eq('provider', provider)
      .eq('provider_user_id', providerUserId)
      .single();

    let user: any;

    if (existingOAuth) {
      // 已绑定，直接登录
      user = existingOAuth.users;
    } else {
      // 未绑定，创建新用户
      const username = `${provider === 'wechat' ? '微信' : '微博'}用户${Date.now().toString().slice(-6)}`;
      
      const { data: newUser, error: createError } = await client
        .from('users')
        .insert({
          username,
          avatar_url: providerData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=002FA7&color=fff`,
        })
        .select()
        .single();

      if (createError) throw createError;
      user = newUser;

      // 创建OAuth绑定
      await client.from('user_oauth_providers').insert({
        user_id: user.id,
        provider,
        provider_user_id: providerUserId,
        provider_data: providerData,
      });
    }

    // 创建登录会话
    const token = generateToken();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000);

    await client.from('user_sessions').insert({
      user_id: user.id,
      token,
      expires_at: expiresAt.toISOString(),
      device_info: { user_agent: req.headers['user-agent'] },
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          avatar_url: user.avatar_url,
          bio: user.bio,
        },
        token,
        expires_at: expiresAt.toISOString(),
        is_new_user: !existingOAuth,
      },
      message: '登录成功',
    });
  } catch (error) {
    console.error('Error oauth login:', error);
    res.status(500).json({ success: false, error: '登录失败' });
  }
});

/**
 * POST /api/v1/auth/logout
 * 退出登录
 * Headers: Authorization: Bearer <token>
 */
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, error: '未登录' });
    }

    const client = getSupabaseClient();

    await client
      .from('user_sessions')
      .delete()
      .eq('token', token);

    res.json({
      success: true,
      message: '已退出登录',
    });
  } catch (error) {
    console.error('Error logout:', error);
    res.status(500).json({ success: false, error: '退出失败' });
  }
});

/**
 * GET /api/v1/auth/me
 * 获取当前登录用户
 * Headers: Authorization: Bearer <token>
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ success: false, error: '未登录' });
    }

    const client = getSupabaseClient();

    // 验证token
    const { data: session, error: sessionError } = await client
      .from('user_sessions')
      .select('*, users(*)')
      .eq('token', token)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session) {
      return res.status(401).json({ success: false, error: '登录已过期，请重新登录' });
    }

    const user = session.users as any;

    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        avatar_url: user.avatar_url,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error('Error get me:', error);
    res.status(500).json({ success: false, error: '获取用户信息失败' });
  }
});

export default router;
