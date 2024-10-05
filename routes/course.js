const {Router}= require("express");

const courseRouter = Router();

courseRouter.get("/preview",(req,res)=>{
    res.json({
        message:"send corses"
    })
})


courseRouter.post("/purchase", (req, res) => {
  res.send("Hello World!");
});

module.exports={
    courseRouter :courseRouter
}