const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the 'public/avatars' folder exists
const uploadPath = path.join(__dirname, '../public/avatars');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
