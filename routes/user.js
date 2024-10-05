const {Router} = require("express");
const userRouter = Router();
const { userAuth } = require("../middleware/userAuth");
const {z}= require("zod");
const { UserModel } = require("../db");
const signupSchema = z.object({
  email: z.string().email("invalid email address"),
  password: z.string().min(5, "password must be greater thn 6 chars"),
  firstName: z.string().min(3).max(100),
  lastName: z.string(),
});
userRouter.post("/signup", async (req, res) => {
  try {
    const validatedSignupSchema = signupSchema.parse(req.body);
    const newUser = await UserModel.create(validatedSignupSchema);
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

userRouter.get("/login", userAuth, (req, res) => {
  res.send("Hello World!");
});

userRouter.get("/purchases", (req, res) => {
  res.send("Hello World!");
});


module.exports = {
  userRouter : userRouter
};
