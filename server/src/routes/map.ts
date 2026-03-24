import { Router, type Request, type Response } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/map/photos
 * 获取地图上的照片点位
 * Query参数：lat, lng, radius(公里), limit
 */
router.get('/photos', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = 50, limit = 100 } = req.query;
    const client = getSupabaseClient();

    let query = client
      .from('photos')
      .select(`
        id,
        title,
        image_url,
        latitude,
        longitude,
        location_name,
        camera_model,
        lens_model,
        likes_count,
        users!photos_user_id_fkey (username)
      `)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('likes_count', { ascending: false })
      .limit(Number(limit));

    // 如果提供了坐标，则查询附近的照片
    if (lat && lng) {
      const latNum = Number(lat);
      const lngNum = Number(lng);
      const radiusNum = Number(radius);
      
      const latRange = radiusNum / 111;
      const lngRange = radiusNum / (111 * Math.cos(latNum * Math.PI / 180));
      
      query = query
        .gte('latitude', latNum - latRange)
        .lte('latitude', latNum + latRange)
        .gte('longitude', lngNum - lngRange)
        .lte('longitude', lngNum + lngRange);
    }

    const { data, error } = await query;

    if (error) throw error;

    const photos = (data || []).map((p: any) => ({
      ...p,
      username: p.users?.username,
    }));

    res.json({
      success: true,
      data: photos,
    });
  } catch (error) {
    console.error('Error fetching map photos:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch map photos' });
  }
});

/**
 * GET /api/v1/map/location/:locationName
 * 根据地点名称搜索照片
 */
router.get('/location/:locationName', async (req: Request, res: Response) => {
  try {
    const { locationName } = req.params;
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('photos')
      .select(`
        *,
        users!photos_user_id_fkey (username, avatar_url)
      `)
      .ilike('location_name', `%${locationName}%`)
      .order('likes_count', { ascending: false })
      .limit(20);

    if (error) throw error;

    const photos = (data || []).map((p: any) => ({
      ...p,
      username: p.users?.username,
      avatar_url: p.users?.avatar_url,
    }));

    res.json({
      success: true,
      data: photos,
    });
  } catch (error) {
    console.error('Error searching by location:', error);
    res.status(500).json({ success: false, error: 'Failed to search by location' });
  }
});

/**
 * GET /api/v1/map/popular-spots
 * 获取热门拍摄地点
 */
router.get('/popular-spots', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('photos')
      .select('location_name, latitude, longitude, likes_count')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .not('location_name', 'is', null);

    if (error) throw error;

    // 按地点分组统计
    const locationMap = new Map<string, { 
      location_name: string; 
      latitude: number; 
      longitude: number; 
      photo_count: number; 
      total_likes: number 
    }>();
    
    (data || []).forEach((photo: any) => {
      const key = photo.location_name;
      if (locationMap.has(key)) {
        const location = locationMap.get(key)!;
        location.photo_count++;
        location.total_likes += photo.likes_count || 0;
      } else {
        locationMap.set(key, {
          location_name: photo.location_name,
          latitude: photo.latitude,
          longitude: photo.longitude,
          photo_count: 1,
          total_likes: photo.likes_count || 0,
        });
      }
    });

    // 按照片数量和点赞数排序
    const spots = Array.from(locationMap.values())
      .sort((a, b) => b.photo_count - a.photo_count || b.total_likes - a.total_likes)
      .slice(0, 20);

    res.json({
      success: true,
      data: spots,
    });
  } catch (error) {
    console.error('Error fetching popular spots:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch popular spots' });
  }
});

export default router;
