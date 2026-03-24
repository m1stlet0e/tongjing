import { Router, type Request, type Response } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/photos
 * 获取照片列表，支持筛选
 * Query参数：page, limit, tab(following/hot/latest), camera, lens, scene
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, tab = 'hot', camera, lens, scene } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const client = getSupabaseClient();

    // 构建基础查询
    let query = client
      .from('photos')
      .select(`
        *,
        users!photos_user_id_fkey (username, avatar_url)
      `);

    // 设备筛选
    if (camera) {
      query = query.ilike('camera_model', `%${camera}%`);
    }

    if (lens) {
      query = query.ilike('lens_model', `%${lens}%`);
    }

    // 场景筛选（需要通过photo_tags表）
    if (scene) {
      const { data: tagPhotos } = await client
        .from('photo_tags')
        .select('photo_id')
        .eq('tag_name', scene);
      
      if (tagPhotos && tagPhotos.length > 0) {
        const photoIds = tagPhotos.map(t => t.photo_id);
        query = query.in('id', photoIds);
      }
    }

    // 排序
    if (tab === 'hot') {
      query = query.order('likes_count', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // 分页
    query = query.range(offset, offset + Number(limit) - 1);

    const { data: photos, error } = await query;

    if (error) throw error;

    // 获取每张照片的标签
    const photosWithTags = await Promise.all(
      (photos || []).map(async (photo) => {
        const { data: tags } = await client
          .from('photo_tags')
          .select('tag_name, tag_type')
          .eq('photo_id', photo.id);

        const user = photo.users as any;
        return {
          ...photo,
          username: user?.username,
          avatar_url: user?.avatar_url,
          tags: tags || [],
          is_liked: false,
          is_favorited: false,
        };
      })
    );

    // 获取总数
    const { count } = await client
      .from('photos')
      .select('*', { count: 'exact', head: true });

    res.json({
      success: true,
      data: {
        photos: photosWithTags,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: count || 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch photos' });
  }
});

/**
 * GET /api/v1/photos/:id
 * 获取照片详情
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();

    const { data: photo, error } = await client
      .from('photos')
      .select(`
        *,
        users!photos_user_id_fkey (username, avatar_url, bio)
      `)
      .eq('id', id)
      .single();

    if (error || !photo) {
      return res.status(404).json({ success: false, error: 'Photo not found' });
    }

    // 获取标签
    const { data: tags } = await client
      .from('photo_tags')
      .select('tag_name, tag_type')
      .eq('photo_id', id);

    // 获取评论
    const { data: comments } = await client
      .from('photo_comments')
      .select(`
        *,
        users!photo_comments_user_id_fkey (username, avatar_url)
      `)
      .eq('photo_id', id)
      .order('created_at', { ascending: false })
      .limit(20);

    const user = photo.users as any;
    res.json({
      success: true,
      data: {
        ...photo,
        username: user?.username,
        avatar_url: user?.avatar_url,
        user_bio: user?.bio,
        tags: tags || [],
        comments: (comments || []).map(c => ({
          ...c,
          username: (c.users as any)?.username,
          avatar_url: (c.users as any)?.avatar_url,
        })),
        is_liked: false,
        is_favorited: false,
      },
    });
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch photo' });
  }
});

/**
 * POST /api/v1/photos
 * 发布照片（包含EXIF自动提取）
 * Body: image_url, title, description, shooting_tips, tags
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      image_url,
      title,
      description,
      shooting_tips,
      tags,
      latitude,
      longitude,
      location_name,
    } = req.body;
    const client = getSupabaseClient();

    // 模拟EXIF数据
    const exifData = {
      camera_brand: 'Sony',
      camera_model: 'A7M4',
      lens_model: 'FE 24-70mm F2.8 GM II',
      focal_length: '35mm',
      aperture: 'F2.8',
      shutter_speed: '1/500s',
      iso: 400,
      white_balance: 'Auto',
    };

    const { data: photo, error } = await client
      .from('photos')
      .insert({
        user_id: 1,
        image_url,
        title,
        description,
        camera_brand: exifData.camera_brand,
        camera_model: exifData.camera_model,
        lens_model: exifData.lens_model,
        focal_length: exifData.focal_length,
        aperture: exifData.aperture,
        shutter_speed: exifData.shutter_speed,
        iso: exifData.iso,
        white_balance: exifData.white_balance,
        latitude,
        longitude,
        location_name,
        shooting_tips,
      })
      .select()
      .single();

    if (error) throw error;

    // 插入标签
    if (tags && Array.isArray(tags)) {
      const tagInserts = tags.map((tag: any) => ({
        photo_id: photo.id,
        tag_name: tag.name,
        tag_type: tag.type,
      }));
      await client.from('photo_tags').insert(tagInserts);
    }

    res.json({
      success: true,
      data: photo,
      message: 'Photo published successfully',
    });
  } catch (error) {
    console.error('Error publishing photo:', error);
    res.status(500).json({ success: false, error: 'Failed to publish photo' });
  }
});

/**
 * POST /api/v1/photos/:id/like
 * 点赞/取消点赞
 */
router.post('/:id/like', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = 1;
    const client = getSupabaseClient();

    // 检查是否已点赞
    const { data: existingLike } = await client
      .from('photo_likes')
      .select('*')
      .eq('photo_id', id)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // 取消点赞
      await client
        .from('photo_likes')
        .delete()
        .eq('photo_id', id)
        .eq('user_id', userId);
      
      await client
        .from('photos')
        .update({ likes_count: client.rpc('decrement_likes', { row_id: id }) })
        .eq('id', id);
      
      // 简单更新：直接减1
      const { data: photo } = await client
        .from('photos')
        .select('likes_count')
        .eq('id', id)
        .single();
      
      if (photo) {
        await client
          .from('photos')
          .update({ likes_count: Math.max(0, (photo.likes_count || 0) - 1) })
          .eq('id', id);
      }

      res.json({ success: true, data: { is_liked: false }, message: 'Unliked' });
    } else {
      // 点赞
      await client.from('photo_likes').insert({ photo_id: Number(id), user_id: userId });
      
      const { data: photo } = await client
        .from('photos')
        .select('likes_count')
        .eq('id', id)
        .single();
      
      if (photo) {
        await client
          .from('photos')
          .update({ likes_count: (photo.likes_count || 0) + 1 })
          .eq('id', id);
      }

      res.json({ success: true, data: { is_liked: true }, message: 'Liked' });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle like' });
  }
});

/**
 * POST /api/v1/photos/:id/favorite
 * 收藏/取消收藏
 */
router.post('/:id/favorite', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = 1;
    const client = getSupabaseClient();

    // 检查是否已收藏
    const { data: existingFavorite } = await client
      .from('photo_favorites')
      .select('*')
      .eq('photo_id', id)
      .eq('user_id', userId)
      .single();

    if (existingFavorite) {
      // 取消收藏
      await client
        .from('photo_favorites')
        .delete()
        .eq('photo_id', id)
        .eq('user_id', userId);
      
      const { data: photo } = await client
        .from('photos')
        .select('favorites_count')
        .eq('id', id)
        .single();
      
      if (photo) {
        await client
          .from('photos')
          .update({ favorites_count: Math.max(0, (photo.favorites_count || 0) - 1) })
          .eq('id', id);
      }

      res.json({ success: true, data: { is_favorited: false }, message: 'Unfavorited' });
    } else {
      // 收藏
      await client.from('photo_favorites').insert({ photo_id: Number(id), user_id: userId });
      
      const { data: photo } = await client
        .from('photos')
        .select('favorites_count')
        .eq('id', id)
        .single();
      
      if (photo) {
        await client
          .from('photos')
          .update({ favorites_count: (photo.favorites_count || 0) + 1 })
          .eq('id', id);
      }

      res.json({ success: true, data: { is_favorited: true }, message: 'Favorited' });
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ success: false, error: 'Failed to toggle favorite' });
  }
});

/**
 * POST /api/v1/photos/:id/comments
 * 添加评论
 */
router.post('/:id/comments', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = 1;
    const client = getSupabaseClient();

    const { data: comment, error } = await client
      .from('photo_comments')
      .insert({ photo_id: Number(id), user_id: userId, content })
      .select()
      .single();

    if (error) throw error;

    // 更新评论计数
    const { data: photo } = await client
      .from('photos')
      .select('comments_count')
      .eq('id', id)
      .single();
    
    if (photo) {
      await client
        .from('photos')
        .update({ comments_count: (photo.comments_count || 0) + 1 })
        .eq('id', id);
    }

    // 获取用户信息
    const { data: user } = await client
      .from('users')
      .select('username, avatar_url')
      .eq('id', userId)
      .single();

    res.json({
      success: true,
      data: {
        ...comment,
        username: user?.username,
        avatar_url: user?.avatar_url,
      },
      message: 'Comment added',
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, error: 'Failed to add comment' });
  }
});

export default router;
