import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinaryInstance from './cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryInstance,
  params: {
    //@ts-ignore
    folder: (req, file) => 'gastry',
  },
});

const parser = multer({ storage });

export default parser;
