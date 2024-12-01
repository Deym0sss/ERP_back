const { validationResult } = require("express-validator");
const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

class AuthController {
  async getUserByUserId(req, res) {
    try {
      const { userId } = req.params;
      const user = await userModel.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: "User with this id doesn`t exist" });
      }

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error", error });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await userModel.find();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error", error });
    }
  }
  async getAllByLocationId(req, res) {
    try {
      const locationId = req.params.locationId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const totalUsers = await userModel.countDocuments({
        locationIds: { $in: [locationId] },
      });

      const users = await userModel
        .find({ locationIds: { $in: [locationId] } })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        users,
        pagination: {
          total: totalUsers,
          page,
          limit,
          totalPages: Math.ceil(totalUsers / limit),
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "error", error });
    }
  }

  async registration(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, phone, name, surname } = req.body;
      const candidate = await userModel.findOne({ email });
      if (candidate) {
        return res.status(400).json({ message: "User already exist." });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new userModel({
        email,
        password: hashedPassword,
        phone,
        name,
        surname,
        locationIds: [],
        role: "Staff",
      });
      await user.save();
      res.status(201).json({ message: "User created." });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Some error." });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        res.status(400).json({ message: "User wasn`t found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Wrong password" });
      }
      const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
        expiresIn: "1h",
      });

      res.json({
        token,
        userId: user.id,
        name: user.name,
        surname: user.surname,
      });
    } catch (error) {
      res.status(500).json({ message: "Some error." });
    }
  }
  async update(req, res) {
    try {
      const { userId } = req.params;
      const updateData = {};
      if (req.body.email) updateData.email = req.body.email;
      if (req.body.password) updateData.password = req.body.password;
      if (req.body.phone) updateData.phone = req.body.phone;
      if (req.body.locationIds) {
        const locationIds = req.body.locationIds.map(
          (id) => new mongoose.Types.ObjectId(id)
        );
        updateData.$addToSet = { locationIds: { $each: locationIds } };
      }

      if (req.body.role) updateData.role = req.body.role;

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ message: "No data to update" });
      }
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User updated", updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "error", error });
    }
  }

  async removeLocation(req, res) {
    try {
      const { userId, locationId } = req.body;
      if (!locationId) {
        return res.status(400).json({ message: "locationId is required" });
      }
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $pull: { locationIds: new mongoose.Types.ObjectId(locationId) } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "Location removed", updatedUser });
    } catch (error) {
      console.error("Error removing location:", error);
      res.status(500).json({ message: "Error", error });
    }
  }

  async delete(req, res) {
    try {
      const { userId } = req.params;
      const user = await userModel.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      res.status(200).json({ message: `deleted user ${user.email}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Some error occurred." });
    }
  }
  async findByEmail(req, res) {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Some error occurred." });
    }
  }
}

module.exports = new AuthController();
