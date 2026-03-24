import { Router, type Request, type Response } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

/**
 * GET /api/v1/photos
 * 获取照片列表，支持筛选
 * Query参数：page, limit, tab(following/hot/latest), camera, lens, scene
 */
router.get('/', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, tab = 'hot', camera, lens, scene } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const client = getSupabaseClient();
    const currentUserId = req.userId;

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

    // 获取每张照片的标签和互动状态
    const photosWithTags = await Promise.all(
      (photos || []).map(async (photo) => {
        const { data: tags } = await client
          .from('photo_tags')
          .select('tag_name, tag_type')
          .eq('photo_id', photo.id);

        // 检查当前用户的点赞/收藏状态
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

        const user = photo.users as any;
        return {
          ...photo,
          username: user?.username,
          avatar_url: user?.avatar_url,
          tags: tags || [],
          is_liked,
          is_favorited,
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
router.get('/:id', optionalAuthMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = getSupabaseClient();
    const currentUserId = req.userId;

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

    // 检查当前用户的点赞/收藏状态
    let is_liked = false;
    let is_favorited = false;

    if (currentUserId) {
      const { data: likeRecord } = await client
        .from('photo_likes')
        .select('id')
        .eq('photo_id', id)
        .eq('user_id', currentUserId)
        .single();
      is_liked = !!likeRecord;

      const { data: favoriteRecord } = await client
        .from('photo_favorites')
        .select('id')
        .eq('photo_id', id)
        .eq('user_id', currentUserId)
        .single();
      is_favorited = !!favoriteRecord;
    }

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
        is_liked,
        is_favorited,
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
 * Body: image_url, title, description, shooting_tips, tags, exif_data
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
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
      exif_data, // 前端解析的EXIF数据
    } = req.body;

    const client = getSupabaseClient();
    const userId = req.userId!;

    // 使用前端传递的EXIF数据，如果没有则使用默认值
    const exifData = exif_data || {
      camera_brand: 'Unknown',
      camera_model: 'Unknown',
      lens_model: null,
      focal_length: null,
      aperture: null,
      shutter_speed: null,
      iso: null,
      white_balance: null,
    };

    const { data: photo, error } = await client
      .from('photos')
      .insert({
        user_id: userId,
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
 * 点赞/取消点赞（需要登录）
 */
router.post('/:id/like', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
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
 * 收藏/取消收藏（需要登录）
 */
router.post('/:id/favorite', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
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
 * 添加评论（需要登录）
 */
router.post('/:id/comments', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.userId!;
    const client = getSupabaseClient();

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ success: false, error: '评论内容不能为空' });
    }

    const { data: comment, error } = await client
      .from('photo_comments')
      .insert({ photo_id: Number(id), user_id: userId, content: content.trim() })
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

/**
 * DELETE /api/v1/photos/:id
 * 删除照片（需要登录且是照片所有者）
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const client = getSupabaseClient();

    // 检查照片是否存在且属于当前用户
    const { data: photo, error: fetchError } = await client
      .from('photos')
      .select('id, user_id')
      .eq('id', id)
      .single();

    if (fetchError || !photo) {
      return res.status(404).json({ success: false, error: '照片不存在' });
    }

    if (photo.user_id !== userId) {
      return res.status(403).json({ success: false, error: '无权删除此照片' });
    }

    // 删除相关数据
    await client.from('photo_likes').delete().eq('photo_id', id);
    await client.from('photo_favorites').delete().eq('photo_id', id);
    await client.from('photo_comments').delete().eq('photo_id', id);
    await client.from('photo_tags').delete().eq('photo_id', id);

    // 删除照片
    await client.from('photos').delete().eq('id', id);

    res.json({
      success: true,
      message: '照片已删除',
    });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ success: false, error: '删除照片失败' });
  }
});

export default router;
