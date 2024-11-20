const { Schema, model } = require("mongoose");

const user = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  locationIds: [{ type: Schema.Types.ObjectId, ref: "Location" }],
  role: { type: String, required: true },
});

module.exports = model("User", user);
