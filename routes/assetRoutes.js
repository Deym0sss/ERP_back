const { Router } = require("express");
const router = new Router();
const multer = require("multer");
const AssetController = require("../controllers/assetController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/uploadImage", upload.single("img"), (req, res) => {
  const imgUrl = `/images/${req.file.filename}`; // Формирование пути к файлу
  res.status(200).json({ message: "Image uploaded", imgUrl });
});

router.get("/ids/:assetIds", AssetController.getByIds);
router.get("/all/:locationId", AssetController.getAllByLocationId);
router.post("/create", AssetController.create);
router.put("/edit/:assetId", AssetController.update);
router.put("/inventory", AssetController.inventory);
router.delete("/:assetId", AssetController.delete);

module.exports = router;
