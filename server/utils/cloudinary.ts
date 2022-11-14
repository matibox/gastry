import cloudinary from 'cloudinary';

const cloudinaryInstance = cloudinary.v2;
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export function uploadImage(imageUploaded: string) {
  return new Promise((resolve, reject) => {
    cloudinaryInstance.uploader.upload(
      imageUploaded,
      { width: 860, height: 574, crop: 'fill' },
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}
