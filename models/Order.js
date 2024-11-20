const { Schema, model } = require("mongoose");

const order = new Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true },
  paymentStatus: { type: String, required: true },
  createdAt: { type: Date, required: true },
  location: { type: Schema.Types.ObjectId, ref: "Location" },
  assets: [
    {
      asset: { type: Schema.Types.ObjectId, ref: "Assets" },
      quantity: { type: String, required: true },
    },
  ],
});

module.exports = model("Order", order);
