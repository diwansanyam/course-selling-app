require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const dbConnection = require("./db");
const app = express();
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/course", courseRouter);

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  app.listen(3000, () => {
    console.log("Server is up and running on port 3000");
  });
}
main();
