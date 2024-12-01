const { default: mongoose } = require("mongoose");
const locationModel = require("../models/Location");

class LocationController {
  async getByIds(req, res) {
    try {
      const { locationIds } = req.params;
      if (!locationIds) {
        return res
          .status(400)
          .json({ message: "locationIds parameter is required." });
      }
      const locations = await locationModel.find({
        _id: { $in: locationIds.split(",") },
      });

      res.status(201).json({ locations });
    } catch (error) {
      res.status(500).json({ message: "Some error." });
    }
  }
  async getAll(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const totalLocations = await locationModel.countDocuments();

      const locations = await locationModel.find().skip(skip).limit(limit);

      res.status(200).json({
        locations,
        pagination: {
          total: totalLocations,
          page,
          limit,
          totalPages: Math.ceil(totalLocations / limit),
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error while fetching locations", error });
    }
  }

  async create(req, res) {
    try {
      const {
        title,
        description,
        address,
        staff,
        city,
        country,
        orders,
        assets,
        logo,
      } = req.body;
      const location = new locationModel({
        title,
        description,
        address,
        staff,
        city,
        country,
        orders,
        assets,
        logo,
      });
      await location.save();
      res.status(200).json({ message: "Location Added", location });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  }

  async update(req, res) {
    try {
      const { locationId } = req.params;
      const updateData = {};
      if (req.body.title) updateData.title = req.body.title;
      if (req.body.description) updateData.description = req.body.description;
      if (req.body.address) updateData.address = req.body.address;
      if (req.body.staff) updateData.staff = req.body.staff;
      if (req.body.city) updateData.city = req.body.city;
      if (req.body.country) updateData.country = req.body.country;
      if (req.body.orders) {
        const orders = req.body.orders;
        new mongoose.Types.ObjectId(orders);
        updateData.$addToSet = { orders: orders };
      }
      if (req.body.assets) {
        const assets = req.body.assets;
        new mongoose.Types.ObjectId(assets);
        updateData.$addToSet = { assets: assets };
      }
      if (req.body.logo) updateData.logo = req.body.logo;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No data to update" });
      }
      const updatedLocation = await locationModel.findByIdAndUpdate(
        locationId,
        updateData,
        { new: true }
      );
      if (!updatedLocation) {
        return res.status(404).json({ message: "Location not found" });
      }
      res.status(200).json({ message: "Location updated", updatedLocation });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async removeAsset(req, res) {
    try {
      const { assetId, locationId } = req.body;
      const updatedLocation = await locationModel.findByIdAndUpdate(
        locationId,
        { $pull: { assets: new mongoose.Types.ObjectId(assetId) } },
        { new: true }
      );
      if (!updatedLocation) {
        return res.status(404).json({ message: "location not found" });
      }
      res.status(200).json({ message: "Location removed", updatedLocation });
    } catch (error) {
      console.error("Error removing location:", error);
      res.status(500).json({ message: "Error", error });
    }
  }
  async removeOrder(req, res) {
    try {
      const { orderId, locationId } = req.body;
      const updatedLocation = await locationModel.findByIdAndUpdate(
        locationId,
        { $pull: { orders: new mongoose.Types.ObjectId(orderId) } },
        { new: true }
      );
      if (!updatedLocation) {
        return res.status(404).json({ message: "location not found" });
      }
      res.status(200).json({ message: "Location removed", updatedLocation });
    } catch (error) {
      console.error("Error removing location:", error);
      res.status(500).json({ message: "Error", error });
    }
  }

  async delete(req, res) {
    try {
      const { locationId } = req.params;
      const location = await locationModel.findByIdAndDelete(locationId);

      if (!location) {
        return res.status(404).json({ message: "Location not found." });
      }

      res.status(200).json({ message: `deleted location ${location.title}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Some error occurred." });
    }
  }
}

module.exports = new LocationController();
