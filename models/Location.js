const { Schema, model } = require("mongoose");

const location = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  staff: [{ type: Schema.Types.ObjectId, ref: "User" }],
  city: { type: String, required: true },
  country: { type: String, required: true },
  orders: [{ type: Schema.Types.ObjectId, ref: "Orders" }],
  assets: [{ type: Schema.Types.ObjectId, ref: "Assets" }],
  logo: { type: String },
});

module.exports = model("Locaiton", location);
