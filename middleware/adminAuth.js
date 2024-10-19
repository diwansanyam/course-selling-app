require("dotenv").config;
const jwt = require("jsonwebtoken");
function adminAuth(req,res,next){
    const token = req.headers.token;
    console.log("token found");
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    if(verifiedToken){
        
        req.adminId=verifiedToken.id;
        console.log(req);
        next();
    }
    else{
        res.status(403).json({message:"invalid admin creds"})
    }
}
module.exports ={
    adminAuth
}