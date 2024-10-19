require("dotenv").config();
const {Router}= require("express");
const adminRouter = Router();
const bcrypt =require("bcrypt");
const {z} = require("zod");
const { adminAuth } = require("../middleware/adminAuth");
const jwt = require("jsonwebtoken");

const { AdminModel, CourseModel } = require("../db");
const signupSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z.string().min(5, "password must be greater thn 6 chars"),
  firstName: z.string().min(3).max(100),
  lastName: z.string(),
});
adminRouter.post("/signup",async (req,res)=>{
   try {
    const validatedSignupSchema = signupSchema.parse(req.body);
    const saltRounds=10;
    const hashedPwd= await bcrypt.hash(validatedSignupSchema.password,saltRounds);
    const adminDetails = {...validatedSignupSchema,password:hashedPwd}
    const newAdmin = await AdminModel.create(adminDetails);
    res.status(200).json({
      message: "signup successfull",
      user: newAdmin,
    });
  } catch (error) {
    if(error instanceof z.ZodError){
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors, 
      });
    }
    else{
      return res.status(500).json({
        message:"server error",
        error:error.message
      })
    }
    
  }
})
adminRouter.get("/login",async (req,res)=>{
  const username = req.body.email;
  const password = req.body.password;
  const admin = await AdminModel.findOne({email:username});
  if (!admin) {
    res.status(400).json({
      message: "admin not found",
    });
  } else {
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (passwordMatch) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_Admin);
      req.token = token;
      res.status(200).json({
        message: "Logged in successfully",
        token,
      });
    } else {
      res.status(400).json({
        message: "incorrect password",
      });
    }
  }
})
adminRouter.post("/course",adminAuth,async(req,res)=>{
    const { title, description, price, imageUrl } = req.body;
    const creatorId = req.adminId;
    const courseCreated = await CourseModel.create({title,description,price,imageUrl,creatorId});
    if(courseCreated){
      res.json({
        message:"course created successfully",
        course:courseCreated
      })
    }
    else{
      res.status(400).json({
        message:"course not creted"
      })
    }
})
adminRouter.put("/course",adminAuth,async(req,res)=>{
  const creatorId = req.body.creatorId;
  const adminId = req.adminId;
  const courseId = req.body.courseId;
  if(creatorId==adminId){
    const {title,description,price,imageUrl}=req.body;
    const updatedCourse = await CourseModel.findByIdAndUpdate(courseId,{title,description,price,imageUrl},{ new: true });
    if(updatedCourse){
      console.log(updatedCourse);
      res.json({
        message:"course updated"
      })
    }
    else{
      res.status(400).json({
        message:"course updation failed"
      })
    }
  }
    res.send("changing the course")
})
adminRouter.get("/course/bulk",adminAuth,async(req,res)=>{
    const courses = await CourseModel.find({creatorId:req.adminId});
    if(courses){
      res.json({
        message:"courses found",
        courses
      })
    }
    else{
      res.json({ message: "not found" });
     
    }
    console.log(courses);
})
module.exports={
    adminRouter:adminRouter
}