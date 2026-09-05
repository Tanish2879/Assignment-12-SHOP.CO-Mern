const JWT = require("jsonwebtoken")
const userModel = require("../models/userModel")

//Protcted Routes
const requireSignin=  async (req,res,next)=>{

    try{
        const decode = JWT.verify(req.header.authorization, process.env.JWT_SECRET);
        req.user = decode;
        next()

    }catch(error){
        return res.status(401).send({
            success:false,
            message:"Invalid or expired JWT"
        })
    }
}

 

const isAdmin = async (req,res,next)=>{

    try{
        const user = await userModel.findbyId(req.user._id)
        if(user.role !== 0 ){
            res.status(401).send({
                success: false,
                message:"UnAuthorized Access"
            })
        }else{
            next();
        }

    }catch(error){
        res.status(401).send({
            success:false,
            message :"Error is admin middleware "
        })

    }


}
module.exports = {requireSignin, isAdmin}