require("dotenv").config;
const jwt = require("jsonwebtoken")
function userAuth(req,res,next){
    const token = req.headers.token;
    const verifiedToken = jwt.verify(token,process.env.JWT_SECRET_USER);
    if (verifiedToken){
        next();
    }
    else{
        res.status(400).json({message:"incorrect details"})
    }
}
module.exports={
    userAuth
}