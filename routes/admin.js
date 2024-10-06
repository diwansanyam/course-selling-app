require("dotenv").config();
const {Router}= require("express");
const adminRouter = Router();
const bcrypt =require("bcrypt");
const {z} = require("zod");
const { adminAuth } = require("../middleware/adminAuth");
const jwt = require("jsonwebtoken");

const { AdminModel } = require("../db");
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
adminRouter.post("/course",(req,res)=>{
    res.send("create course")
})
adminRouter.put("/course",(req,res)=>{
    res.send("changing the course")
})
adminRouter.get("/course/bulk",(req,res)=>{
    res.send("get all courses")
})
module.exports={
    adminRouter:adminRouter
}