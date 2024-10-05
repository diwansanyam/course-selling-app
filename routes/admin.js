const {Router}= require("express")
const adminRouter = Router()
const { adminAuth } = require("../middleware/adminAuth");

const { AdminModel } = require("../db");
adminRouter.post("/signup",(req,res)=>{
    res.send("signup admin")
})
adminRouter.get("/login",adminAuth,(req,res)=>{
    res.json({
        message:"login success"
    })
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