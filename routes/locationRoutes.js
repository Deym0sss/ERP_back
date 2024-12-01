const { Router } = require("express");
const router = new Router();
const multer = require("multer");
const LocationController = require("../controllers/locationController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/logos"); // Папка для хранения логотипов
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Генерация уникального имени
  },
});

const upload = multer({ storage });

router.post("/uploadLogo", upload.single("logo"), (req, res) => {
  const logoUrl = `/logos/${req.file.filename}`; // Формирование пути к файлу
  res.status(200).json({ message: "Logo uploaded", logoUrl });
});

router.get("/ids/:locationIds", LocationController.getByIds);
router.get("/all", LocationController.getAll);
router.post("/create", LocationController.create);
router.put("/removeAsset", LocationController.removeAsset);
router.put("/removeOrder", LocationController.removeOrder);
router.put("/edit/:locationId", LocationController.update);
router.delete("/:locationId", LocationController.delete);

module.exports = router;
