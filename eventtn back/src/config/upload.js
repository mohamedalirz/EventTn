const multer = require('multer');
const path = require('path');
const fs = require('fs');
const streamifier = require('streamifier');
const { cloudinary, isCloudinaryConfigured } = require('./cloudinary');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are allowed'), false);
  }
};

let storage;

if (isCloudinaryConfigured) {
  // Buffer the file in memory; we upload it to Cloudinary manually
  // in the uploadBufferToCloudinary middleware below (avoids the
  // multer-storage-cloudinary package, which only supports Cloudinary v1).
  storage = multer.memoryStorage();
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      cb(null, uniqueName);
    },
  });
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * When Cloudinary is configured, req.file only holds an in-memory buffer
 * (multer.memoryStorage). This middleware streams that buffer to Cloudinary
 * and rewrites req.file.path to the resulting secure_url so controllers can
 * keep using `req.file.path` the same way regardless of storage backend.
 * When Cloudinary isn't configured, this middleware is a no-op.
 */
const uploadBufferToCloudinary = (req, res, next) => {
  if (!isCloudinaryConfigured || !req.file || !req.file.buffer) {
    return next();
  }

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'eventtn/banners',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1200, height: 630, crop: 'limit' }],
    },
    (error, result) => {
      if (error) return next(error);
      req.file.path = result.secure_url;
      req.file.filename = result.public_id;
      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
};

module.exports = { upload, uploadBufferToCloudinary, isCloudinaryConfigured };
