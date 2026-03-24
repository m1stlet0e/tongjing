import { Router, type Request, type Response } from 'express';
import multer from 'multer';
import { S3Storage } from 'coze-coding-dev-sdk';
import exifr from 'exifr';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 初始化对象存储
const storage = new S3Storage({
  endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
  accessKey: '',
  secretKey: '',
  bucketName: process.env.COZE_BUCKET_NAME,
  region: 'cn-beijing',
});

// 配置 multer 用于接收文件
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 最大 10MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片类型
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'));
    }
  },
});

/**
 * 从图片 Buffer 中提取 EXIF 数据
 */
const extractExifData = async (buffer: Buffer): Promise<{
  camera_brand: string | null;
  camera_model: string | null;
  lens_model: string | null;
  focal_length: string | null;
  aperture: string | null;
  shutter_speed: string | null;
  iso: number | null;
  latitude: number | null;
  longitude: number | null;
  create_time: Date | null;
}> => {
  try {
    const exif = await exifr.parse(buffer, {
      pick: [
        'Make', 'Model', 'LensModel', 'FocalLength', 'FNumber', 
        'ExposureTime', 'ISO', 'GPSLatitude', 'GPSLongitude', 
        'DateTimeOriginal', 'CreateDate'
      ]
    });

    if (!exif) {
      return {
        camera_brand: null,
        camera_model: null,
        lens_model: null,
        focal_length: null,
        aperture: null,
        shutter_speed: null,
        iso: null,
        latitude: null,
        longitude: null,
        create_time: null,
      };
    }

    // 处理光圈值
    let aperture: string | null = null;
    if (exif.FNumber) {
      aperture = `F${typeof exif.FNumber === 'number' ? exif.FNumber : exif.FNumber.valueOf()}`;
    }

    // 处理快门速度
    let shutterSpeed: string | null = null;
    if (exif.ExposureTime) {
      const exposure = typeof exif.ExposureTime === 'number' 
        ? exif.ExposureTime 
        : exif.ExposureTime.valueOf();
      if (exposure < 1) {
        shutterSpeed = `1/${Math.round(1 / exposure)}s`;
      } else {
        shutterSpeed = `${exposure}s`;
      }
    }

    // 处理焦距
    let focalLength: string | null = null;
    if (exif.FocalLength) {
      const focal = typeof exif.FocalLength === 'number' 
        ? exif.FocalLength 
        : exif.FocalLength.valueOf();
      focalLength = `${focal}mm`;
    }

    return {
      camera_brand: exif.Make || null,
      camera_model: exif.Model || null,
      lens_model: exif.LensModel || null,
      focal_length: focalLength,
      aperture: aperture,
      shutter_speed: shutterSpeed,
      iso: exif.ISO || null,
      latitude: exif.GPSLatitude || null,
      longitude: exif.GPSLongitude || null,
      create_time: exif.DateTimeOriginal || exif.CreateDate || null,
    };
  } catch (error) {
    console.error('Error extracting EXIF:', error);
    return {
      camera_brand: null,
      camera_model: null,
      lens_model: null,
      focal_length: null,
      aperture: null,
      shutter_speed: null,
      iso: null,
      latitude: null,
      longitude: null,
      create_time: null,
    };
  }
};

/**
 * POST /api/v1/upload/image
 * 上传单张图片并提取 EXIF
 * 需要登录
 * Content-Type: multipart/form-data
 * Body: file (图片文件)
 * 返回: { success: true, data: { url: string, key: string, exif: object } }
 */
router.post('/image', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, error: '请选择要上传的图片' });
    }

    // 提取 EXIF 数据
    const exifData = await extractExifData(file.buffer);

    // 生成文件名
    const ext = file.originalname.split('.').pop() || 'jpg';
    const fileName = `photos/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    // 上传到对象存储
    const key = await storage.uploadFile({
      fileContent: file.buffer,
      fileName,
      contentType: file.mimetype,
    });

    // 生成签名 URL（有效期 30 天）
    const url = await storage.generatePresignedUrl({
      key,
      expireTime: 30 * 24 * 60 * 60, // 30 天
    });

    res.json({
      success: true,
      data: {
        url,
        key,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
        exif: exifData,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: '上传失败' });
  }
});

/**
 * POST /api/v1/upload/images
 * 批量上传图片（最多 9 张）
 * 需要登录
 * Content-Type: multipart/form-data
 * Body: files[] (图片文件数组)
 * 返回: { success: true, data: { images: [{ url, key, filename, size, exif }] } }
 */
router.post('/images', authMiddleware, upload.array('files', 9), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, error: '请选择要上传的图片' });
    }

    // 并行上传所有图片
    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const ext = file.originalname.split('.').pop() || 'jpg';
        const fileName = `photos/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

        // 提取 EXIF
        const exifData = await extractExifData(file.buffer);

        // 上传
        const key = await storage.uploadFile({
          fileContent: file.buffer,
          fileName,
          contentType: file.mimetype,
        });

        const url = await storage.generatePresignedUrl({
          key,
          expireTime: 30 * 24 * 60 * 60, // 30 天
        });

        return {
          url,
          key,
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          exif: exifData,
        };
      })
    );

    res.json({
      success: true,
      data: {
        images: uploadResults,
      },
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ success: false, error: '上传失败' });
  }
});

/**
 * POST /api/v1/upload/avatar
 * 上传用户头像
 * 需要登录
 * Content-Type: multipart/form-data
 * Body: file (图片文件)
 * 返回: { success: true, data: { url: string, key: string } }
 */
router.post('/avatar', authMiddleware, upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const userId = req.userId!;

    if (!file) {
      return res.status(400).json({ success: false, error: '请选择要上传的头像' });
    }

    // 生成文件名
    const ext = file.originalname.split('.').pop() || 'jpg';
    const fileName = `avatars/${userId}_${Date.now()}.${ext}`;

    // 上传到对象存储
    const key = await storage.uploadFile({
      fileContent: file.buffer,
      fileName,
      contentType: file.mimetype,
    });

    // 生成签名 URL（有效期 30 天）
    const url = await storage.generatePresignedUrl({
      key,
      expireTime: 30 * 24 * 60 * 60, // 30 天
    });

    res.json({
      success: true,
      data: {
        url,
        key,
      },
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    res.status(500).json({ success: false, error: '上传失败' });
  }
});

export default router;
