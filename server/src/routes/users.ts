import { Router, type Request, type Response } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

/**
 * GET /api/v1/users/me
 * 获取当前登录用户信息（需要登录）
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();
    const userId = req.userId!;

    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // 获取统计数据
    const { count: photosCount } = await client
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    const { count: followersCount } = await client
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', userId);

    const { count: followingCount } = await client
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', userId);

    res.json({
      success: true,
      data: {
        ...user,
        photos_count: photosCount || 0,
        followers_count: followersCount || 0,
        following_count: followingCount || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

/**
 * PATCH /api/v1/users/me
 * 更新当前用户信息（需要登录）
 */
router.patch('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { username, bio, avatar_url } = req.body;
    const client = getSupabaseClient();
    const userId = req.userId!;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (bio !== undefined) updateData.bio = bio;
    if (avatar_url) updateData.avatar_url = avatar_url;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ success: false, error: '没有要更新的内容' });
    }

    const { data: user, error } = await client
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      data: user,
      message: '更新成功',
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ success: false, error: '更新失败' });
  }
});

/**
 * GET /api/v1/users/:id
 * 获取用户信息
 */
router.get('/:id', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId;
    const client = getSupabaseClient();

    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // 获取统计数据
    const { count: photosCount } = await client
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    const { count: followersCount } = await client
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', id);

    const { count: followingCount } = await client
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', id);

    // 检查是否已关注
    let is_following = false;
    if (currentUserId) {
      const { data: follow } = await client
        .from('user_follows')
        .select('*')
        .eq('follower_id', currentUserId)
        .eq('following_id', id)
        .single();
      is_following = !!follow;
    }

    res.json({
      success: true,
      data: {
        ...user,
        photos_count: photosCount || 0,
        followers_count: followersCount || 0,
        following_count: followingCount || 0,
        is_following,
      },
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user' });
  }
});

/**
 * GET /api/v1/users/:id/photos
 * 获取用户的作品集
 */
router.get('/:id/photos', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const client = getSupabaseClient();
    const currentUserId = req.userId;

    const { data: photos, error } = await client
      .from('photos')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) throw error;

    const { count } = await client
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    // 检查当前用户的点赞/收藏状态
    const photosWithStatus = await Promise.all(
      (photos || []).map(async (photo) => {
        let is_liked = false;
        let is_favorited = false;

        if (currentUserId) {
          const { data: likeRecord } = await client
            .from('photo_likes')
            .select('id')
            .eq('photo_id', photo.id)
            .eq('user_id', currentUserId)
            .single();
          is_liked = !!likeRecord;

          const { data: favoriteRecord } = await client
            .from('photo_favorites')
            .select('id')
            .eq('photo_id', photo.id)
            .eq('user_id', currentUserId)
            .single();
          is_favorited = !!favoriteRecord;
        }

        return {
          ...photo,
          is_liked,
          is_favorited,
        };
      })
    );

    res.json({
      success: true,
      data: {
        photos: photosWithStatus,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user photos:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user photos' });
  }
});

/**
 * GET /api/v1/users/:id/favorites
 * 获取用户的收藏
 */
router.get('/:id/favorites', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const client = getSupabaseClient();
    const currentUserId = req.userId;

    const { data: favorites, error } = await client
      .from('photo_favorites')
      .select(`
        created_at,
        photos (
          *,
          users!photos_user_id_fkey (username, avatar_url)
        )
      `)
      .eq('user_id', id)
      .order('created_at', { ascending: false })
      .range(offset, offset + Number(limit) - 1);

    if (error) throw error;

    const { count } = await client
      .from('photo_favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);

    const photos = await Promise.all(
      (favorites || []).map(async (f: any) => {
        let is_liked = false;

        if (currentUserId) {
          const { data: likeRecord } = await client
            .from('photo_likes')
            .select('id')
            .eq('photo_id', f.photos?.id)
            .eq('user_id', currentUserId)
            .single();
          is_liked = !!likeRecord;
        }

        return {
          ...f.photos,
          username: f.photos?.users?.username,
          avatar_url: f.photos?.users?.avatar_url,
          favorited_at: f.created_at,
          is_liked,
          is_favorited: true,
        };
      })
    );

    res.json({
      success: true,
      data: {
        photos,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user favorites' });
  }
});

/**
 * GET /api/v1/users/:id/footprint
 * 获取用户的拍摄足迹
 */
router.get('/:id/footprint', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();

    const { data: photos, error } = await client
      .from('photos')
      .select('id, latitude, longitude, location_name, image_url, title')
      .eq('user_id', id)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) throw error;

    // 按地点分组统计
    const locationMap = new Map<string, { 
      latitude: number; 
      longitude: number; 
      location_name: string; 
      photo_count: number;
      photos: any[];
    }>();
    
    (photos || []).forEach((photo: any) => {
      const key = photo.location_name || `${photo.latitude},${photo.longitude}`;
      if (locationMap.has(key)) {
        const loc = locationMap.get(key)!;
        loc.photo_count++;
        loc.photos.push(photo);
      } else {
        locationMap.set(key, {
          latitude: photo.latitude,
          longitude: photo.longitude,
          location_name: photo.location_name,
          photo_count: 1,
          photos: [photo],
        });
      }
    });

    res.json({
      success: true,
      data: Array.from(locationMap.values()),
    });
  } catch (error) {
    console.error('Error fetching user footprint:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user footprint' });
  }
});

/**
 * POST /api/v1/users/:id/follow
 * 关注/取消关注用户（需要登录）
 */
router.post('/:id/follow', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId!;
    const client = getSupabaseClient();

    if (Number(id) === currentUserId) {
      return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
    }

    // 检查目标用户是否存在
    const { data: targetUser } = await client
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (!targetUser) {
      return res.status(404).json({ success: false, error: '用户不存在' });
    }

    // 检查是否已关注
    const { data: existingFollow } = await client
      .from('user_follows')
      .select('*')
      .eq('follower_id', currentUserId)
      .eq('following_id', id)
      .single();

    if (existingFollow) {
      // 取消关注
      await client
        .from('user_follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', id);
      
      res.json({ success: true, data: { is_following: false }, message: 'Unfollowed' });
    } else {
      // 关注
      await client
        .from('user_follows')
        .insert({ follower_id: currentUserId, following_id: Number(id) });
      
      res.json({ success: true, data: { is_following: true }, message: 'Followed' });
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle follow' });
  }
});

export default router;
