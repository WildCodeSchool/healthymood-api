const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const maxSize = 1 * 1024 * 1024;
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    const err = 'Error: File upload only supports the following filetypes - ' + filetypes;
    console.error(err);
    cb(err);
  }
};

const upload = multer({ storage, limits: maxSize, fileFilter }).single('picture');

module.exports = upload;
