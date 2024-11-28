const { Router } = require("express");
const { check } = require("express-validator");
const router = new Router();
const AuthController = require("../controllers/authController");

router.get("/users", AuthController.getUsers);
router.get("/:userId", AuthController.getUserByUserId);
router.get("/all/:locationId", AuthController.getAllByLocationId);
router.post("/id", AuthController.findByEmail);
router.post(
  "/register",
  [
    check("email", "Incorrect email").isEmail(),
    check("password", "Incorrect password").isLength({ min: 6 }),
  ],
  AuthController.registration
);

router.post(
  "/login",
  [
    check("email", "Incorrect email").normalizeEmail().isEmail(),
    check("password", "Incorrect password").isLength({ min: 6 }),
  ],
  AuthController.login
);
router.put("/edit", AuthController.removeLocation);
router.put("/edit/:userId", AuthController.update);

router.delete("/:userId", AuthController.delete);

module.exports = router;
