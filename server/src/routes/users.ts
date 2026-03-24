import { Router, type Request, type Response } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/users/me
 * 获取当前用户信息
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();

    const { data: user, error } = await client
      .from('users')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // 获取统计数据
    const { count: photosCount } = await client
      .from('photos')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', 1);

    const { count: followersCount } = await client
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('following_id', 1);

    const { count: followingCount } = await client
      .from('user_follows')
      .select('*', { count: 'exact', head: true })
      .eq('follower_id', 1);

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
 * GET /api/v1/users/:id
 * 获取用户信息
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
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
    const { data: follow } = await client
      .from('user_follows')
      .select('*')
      .eq('follower_id', 1)
      .eq('following_id', id)
      .single();

    res.json({
      success: true,
      data: {
        ...user,
        photos_count: photosCount || 0,
        followers_count: followersCount || 0,
        following_count: followingCount || 0,
        is_following: !!follow,
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
router.get('/:id/photos', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const client = getSupabaseClient();

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

    res.json({
      success: true,
      data: {
        photos: (photos || []).map(p => ({
          ...p,
          is_liked: false,
          is_favorited: false,
        })),
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
router.get('/:id/favorites', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const client = getSupabaseClient();

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

    const photos = (favorites || []).map((f: any) => ({
      ...f.photos,
      username: f.photos?.users?.username,
      avatar_url: f.photos?.users?.avatar_url,
      favorited_at: f.created_at,
    }));

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
      .select('latitude, longitude, location_name')
      .eq('user_id', id)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    if (error) throw error;

    // 按地点分组统计
    const locationMap = new Map<string, { latitude: number; longitude: number; location_name: string; photo_count: number }>();
    
    (photos || []).forEach((photo: any) => {
      const key = photo.location_name || `${photo.latitude},${photo.longitude}`;
      if (locationMap.has(key)) {
        locationMap.get(key)!.photo_count++;
      } else {
        locationMap.set(key, {
          latitude: photo.latitude,
          longitude: photo.longitude,
          location_name: photo.location_name,
          photo_count: 1,
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
 * 关注/取消关注用户
 */
router.post('/:id/follow', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const currentUserId = 1;
    const client = getSupabaseClient();

    if (Number(id) === currentUserId) {
      return res.status(400).json({ success: false, error: 'Cannot follow yourself' });
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
