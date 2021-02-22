const multer = require("multer");

module.exports.uploadImages = (type) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("path :", `${__dirname}/../img/${type}s`);
      cb(null, `${__dirname}/../../img/${type}s`); 
    },
    filename: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const upload = multer({ storage: storage });
  return upload.single(type); // MDW (req,res,next)
};
