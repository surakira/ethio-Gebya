const User=require('../model/user');
const jwt=require('jsonwebtoken');
const ErrorHandeler=require('../utile/errorHandler');
const catchAsyncError=require("./catchAsync");
exports.isAuthenticatedUser=catchAsyncError(async (req,res,next)=>{
    const {token}=req.cookies
    if(!token){
        return next(new ErrorHandeler('login first to accsess the Resource',401));

    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await  User.findById(decoded.id)
    next()
})
exports.authrizeRoles=(...roles)=>{
    return(req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandeler(`role(${req.user.role})is not allowd to access this`,403))
        }
        next()
    }
}