const { default: mongoose } = require("mongoose");
const assetModel = require("../models/Asset");

class AssetController {
  async getByIds(req, res) {
    try {
      const { assetIds } = req.params;
      if (!assetIds) {
        return res
          .status(400)
          .json({ message: "assetIds parameter is required." });
      }
      const assets = await assetModel.find({
        _id: { $in: assetIds.split(",") },
      });

      res.status(201).json({ assets });
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
      const totalAssets = await assetModel.countDocuments({
        location: locationId,
      });

      const assets = await assetModel
        .find({ location: locationId })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        assets,
        pagination: {
          total: totalAssets,
          page,
          limit,
          totalPages: Math.ceil(totalAssets / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Error while fetching assets", error });
    }
  }

  async create(req, res) {
    try {
      const { title, description, tag, value, location, img, cost } = req.body;

      const asset = new assetModel({
        title,
        description,
        tag,
        value,
        location,
        img,
        cost,
      });
      await asset.save();
      res.status(200).json(asset);
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async updateAssets(req, res) {
    try {
      const { assets } = req.body;
      console.log(assets);

      if (!assets || !Array.isArray(assets)) {
        return res.status(400).json({ message: "Invalid assets data" });
      }

      for (const asset of assets) {
        await assetModel.findByIdAndUpdate(asset.key, { value: asset.value });
      }

      res.status(200).json({ message: "Assets updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
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

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No data to update" });
      }

      const updatedOrder = await orderModel.findByIdAndUpdate(
        orderId,
        updateData,
        {
          new: true,
        }
      );

      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Order updated", updatedOrder });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async inventory(req, res) {
    try {
      const assetsToUpdate = req.body;
      for (const { assetId, value } of assetsToUpdate) {
        await assetModel.findByIdAndUpdate(assetId, { value });
      }

      res.status(200).json({ message: "Assets updated successfully" });
    } catch (error) {
      console.error("Error updating assets:", error);
      res.status(500).json({ message: "Failed to update assets" });
    }
  }

  async delete(req, res) {
    try {
      const { assetId } = req.params;
      const asset = await assetModel.findByIdAndDelete(assetId);

      if (!asset) {
        return res.status(404).json({ message: "Location not found." });
      }

      res.status(200).json({ message: `deleted asset ${asset.title}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Some error occurred." });
    }
  }
}

module.exports = new AssetController();
