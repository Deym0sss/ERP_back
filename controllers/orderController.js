const orderModel = require("../models/Order");

class OrderController {
  async getByIds(req, res) {
    try {
      const { orderIds } = req.params;
      if (!orderIds) {
        return res
          .status(400)
          .json({ message: "orderIds parameter is required." });
      }
      const orders = await orderModel.find({
        _id: { $in: orderIds.split(",") },
      });

      res.status(201).json({ orders });
    } catch (error) {
      res.status(500).json({ message: "Some error." });
    }
  }
  async getAllByLocationId(req, res) {
    try {
      const locationId = req.params.locationId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const totalOrders = await orderModel.countDocuments({
        location: locationId,
      });

      const orders = await orderModel
        .find({ location: locationId })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        orders,
        pagination: {
          total: totalOrders,
          page,
          limit,
          totalPages: Math.ceil(totalOrders / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error while fetching orders", error });
    }
  }

  async create(req, res) {
    try {
      console.log(req.body);

      const {
        title,
        type,
        status,
        paymentStatus,
        createdAt,
        location,
        assets,
      } = req.body;

      const order = new orderModel({
        title,
        type,
        status,
        paymentStatus,
        createdAt,
        location,
        assets,
      });
      await order.save();
      res.status(200).json({ message: "Order Added", order });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error });
    }
  }
  async update(req, res) {
    try {
      const { orderId } = req.params;
      const updateData = {};

      if (req.body.title) updateData.title = req.body.title;
      if (req.body.type) updateData.type = req.body.type;
      if (req.body.status) updateData.status = req.body.status;
      if (req.body.paymentStatus)
        updateData.paymentStatus = req.body.paymentStatus;
      if (req.body.createdAt) updateData.createdAt = req.body.createdAt;
      if (req.body.location) updateData.location = req.body.location;
      if (req.body.assets) updateData.assets = req.body.assets;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No data to update" });
      }

      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        updateData,
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order updated", updatedOrder });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { orderId } = req.params;
      const order = await orderModel.findByIdAndDelete(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      res.status(200).json({ message: `deleted order ${order.title}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Some error occurred." });
    }
  }
}

module.exports = new OrderController();
