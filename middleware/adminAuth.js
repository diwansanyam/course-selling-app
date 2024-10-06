require("dotenv").config;
const jwt = require("jsonwebtoken");
function adminAuth(req,res,next){
    const token = req.headers.token;
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_USER);
    if(verifiedToken){
        req.adminId=verifiedToken.id;
        next();
    }
    else{
        res.status(403).json({message:"invalid admin creds"})
    }
}
module.exports ={
    adminAuth
}