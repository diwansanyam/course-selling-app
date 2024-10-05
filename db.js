const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
const userSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});
const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageUrl: String,
  creatorId: ObjectId,
});
const adminSchema = new Schema({
  email: { type: String, unique: true },
  password: String,
  firstName: String,
  lastName: String,
});
const purchaseSchema = new Schema({
  courseId: ObjectId,
  userId: ObjectId,
});

const UserModel = mongoose.model("user", userSchema);
const CourseModel = mongoose.model("course", courseSchema);
const AdminModel = mongoose.model("admin", adminSchema);
const PurchaseModel = mongoose.model("purchases", purchaseSchema);

module.exports = {
  UserModel,
  CourseModel,
  AdminModel,
  PurchaseModel,
};
