import { Router, type Request, type Response } from 'express';
import { getSupabaseClient } from '../storage/database/supabase-client';

const router = Router();

/**
 * GET /api/v1/equipment
 * 获取设备列表
 * Query参数：type(camera/lens), brand
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, brand } = req.query;
    const client = getSupabaseClient();

    let query = client.from('equipment').select('*');

    if (type) {
      query = query.eq('type', type);
    }

    if (brand) {
      query = query.ilike('brand', `%${brand}%`);
    }

    const { data: equipment, error } = await query.order('brand').order('model');

    if (error) throw error;

    // 按品牌分组
    const groupedByBrand = (equipment || []).reduce((acc, item) => {
      if (!acc[item.brand]) {
        acc[item.brand] = [];
      }
      acc[item.brand].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    res.json({
      success: true,
      data: {
        equipment: equipment || [],
        groupedByBrand,
      },
    });
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch equipment' });
  }
});

/**
 * GET /api/v1/equipment/brands
 * 获取所有品牌列表
 */
router.get('/brands', async (req: Request, res: Response) => {
  try {
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('equipment')
      .select('brand')
      .order('brand');

    if (error) throw error;

    const brands = [...new Set((data || []).map(item => item.brand))];

    res.json({
      success: true,
      data: brands,
    });
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch brands' });
  }
});

/**
 * GET /api/v1/equipment/user/:userId
 * 获取用户的装备库
 */
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const client = getSupabaseClient();

    const { data, error } = await client
      .from('user_equipment')
      .select(`
        created_at,
        equipment (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const equipment = (data || []).map((item: any) => ({
      ...item.equipment,
      added_at: item.created_at,
    }));

    // 按类型分组
    const groupedByType = equipment.reduce((acc, item) => {
      if (!acc[item.type]) {
        acc[item.type] = [];
      }
      acc[item.type].push(item);
      return acc;
    }, {} as Record<string, any[]>);

    res.json({
      success: true,
      data: {
        equipment,
        groupedByType,
      },
    });
  } catch (error) {
    console.error('Error fetching user equipment:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch user equipment' });
  }
});

/**
 * POST /api/v1/equipment/user/:userId
 * 添加装备到用户装备库
 */
router.post('/user/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { equipment_id } = req.body;
    const client = getSupabaseClient();

    // 检查是否已存在
    const { data: existing } = await client
      .from('user_equipment')
      .select('*')
      .eq('user_id', userId)
      .eq('equipment_id', equipment_id)
      .single();

    if (existing) {
      return res.status(400).json({ success: false, error: 'Equipment already added' });
    }

    const { error } = await client
      .from('user_equipment')
      .insert({ user_id: Number(userId), equipment_id });

    if (error) throw error;

    res.json({
      success: true,
      message: 'Equipment added to your collection',
    });
  } catch (error) {
    console.error('Error adding equipment:', error);
    res.status(500).json({ success: false, error: 'Failed to add equipment' });
  }
});

/**
 * DELETE /api/v1/equipment/user/:userId/:equipmentId
 * 从用户装备库移除装备
 */
router.delete('/user/:userId/:equipmentId', async (req: Request, res: Response) => {
  try {
    const { userId, equipmentId } = req.params;
    const client = getSupabaseClient();

    const { error } = await client
      .from('user_equipment')
      .delete()
      .eq('user_id', userId)
      .eq('equipment_id', equipmentId);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Equipment removed from your collection',
    });
  } catch (error) {
    console.error('Error removing equipment:', error);
    res.status(500).json({ success: false, error: 'Failed to remove equipment' });
  }
});

export default router;
