require("dotenv").config();
const jwt = require("jsonwebtoken");
const {Router} = require("express");
const userRouter = Router();
const { userAuth } = require("../middleware/userAuth");
const {z}= require("zod");
const { UserModel, PurchaseModel, CourseModel } = require("../db");
const bcrypt = require('bcrypt');
const signupSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z.string().min(5, "password must be greater thn 6 chars"),
  firstName: z.string().min(3).max(100),
  lastName: z.string(),
});
userRouter.post("/signup", async (req, res) => {
  try {
    const validatedSignupSchema = signupSchema.parse(req.body);
    const saltRounds=10;
    const hashedPwd= await bcrypt.hash(validatedSignupSchema.password,saltRounds);
    const userDetails = {...validatedSignupSchema,password:hashedPwd}
    const newUser = await UserModel.create(userDetails);
    res.status(200).json({
      message:"signup successfull",
      user:newUser
    })
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
});

userRouter.get("/login",  async (req, res) => {
  const username = req.body.email;
  const password = req.body.password;
  const user = await UserModel.findOne({email:username});
  if(!user){
    res.status(400).json({
      message:"user not found"
    })
  }else{
    const passwordMatch = await bcrypt.compare(password,user.password);
    if(passwordMatch){
      const token =jwt.sign({id:user._id},process.env.JWT_SECRET_USER)
      req.token=token;
      res.status(200).json({
        message:"Logged in successfully",
        token
      })
    }
    else{
      res.status(400).json({
        message:"incoorect password"
      })
    }
  }
}); 
userRouter.get("/purchases",userAuth, async (req, res) => {
  const userId = req.userId;
  const purchasedCourses =await PurchaseModel.find({userId});
  const coursesData = await CourseModel.find(
   { _id: {$in : purchasedCourses.map(x=>x.courseId)}}
  )
  res.json({
    purchasedCourses,
    coursesData
  })

});


module.exports = {
  userRouter : userRouter
};
