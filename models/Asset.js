const { Schema, model } = require("mongoose");

const asset = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tag: { type: String, required: true },
  value: { type: String, default: 0 },
  location: { type: Schema.Types.ObjectId, ref: "Location" },
  image: { type: String },
  cost: { type: Number, default: 0 },
});

module.exports = model("Asset", asset);
