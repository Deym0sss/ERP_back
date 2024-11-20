const { Router } = require("express");
const router = new Router();
const OrderController = require("../controllers/orderController");

router.get("/ids/:orderIds", OrderController.getByIds);
router.get("/all/:locationId", OrderController.getAllByLocationId);
router.post("/create", OrderController.create);
router.put("/edit/:orderId", OrderController.update);
router.delete("/:orderId", OrderController.delete);
module.exports = router;
