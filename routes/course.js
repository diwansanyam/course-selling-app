const {Router}= require("express");
const { userRouter } = require("./user");
const { PurchaseModel, CourseModel } = require("../db");
const { userAuth } = require("../middleware/userAuth");

const courseRouter = Router();

courseRouter.get("/preview",async(req,res)=>{
    const courses = await CourseModel.find({});
    res.json({
        courses
    })
})


courseRouter.post("/purchase",userAuth, async(req, res) => {
    const userId=req.userId;
    const courseId =req.body.courseId;
    const purchases = await PurchaseModel.create({
        courseId,
        userId
    })
 
  res.json({
    purchases
  });
});

module.exports={
    courseRouter :courseRouter
}