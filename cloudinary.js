const dotenv = require('dotenv')
dotenv.config()
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
    // secure: true
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'SportTogether',
        allowed_formats: ['jpeg','png', 'jpg'],
    }
});

module.exports = {
    cloudinary,
    storage
}