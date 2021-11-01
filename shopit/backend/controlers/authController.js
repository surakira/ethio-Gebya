const User=require('../model/user');
const ErrorHandeler=require('../utile/errorHandler');
const catchAsyncError=require('../middlewares/catchAsync');
const sendToken = require('../utile/jwtToken');
const { use } = require('../routs/auth');
exports.registerUser=catchAsyncError(async (req,res,next)=>{
    const {name,email,password}=req.body;
    const user=await User.create({
        name,email,password,
        avater:{
            public_id:'products/macbook_o2cj2k',
            url:'https://res.cloudinary.com/bookit/image/upload/v1606231282/products/macbook_o2cj2k.jpg'
        }
    })
   sendToken(user,200,res)
})
//Login to the system
exports.loginUser=catchAsyncError( async (req,res,next)=>{
     const {password,email}=req.body;
    if(!email||!password){
        return next(new ErrorHandeler('pleas enter password and email',400))
    }
   const user =await User.findOne({email}).select('+password')
   //finding user
   if(!user){
       return next(new ErrorHandeler('Invalid Email or password',401))
   }
   const isPasswordMatched=await user.comparePassword(password);
   if(!isPasswordMatched){
       return next(new ErrorHandeler('Invalid password or Email',401));

   }
   sendToken(user,200,res)
})
//logOut user
exports.logout=catchAsyncError(async (req,res,next)=>{
    res.cookie('token',null,{
        expires:new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        seccess:true,
        message:'you are logout'
    })
})
//Get currently logged in user detail
exports.getUserProfile=catchAsyncError(async (req,res,next)=>{
    const user=await User.findById(req.user.id);
    res.status(200).json({
        seccess:true,
        user
    })
})
//change/Update password
exports.updatePassword=catchAsyncError(async (req,res,next)=>{
    const user=await User.findById(req.user.id).select('+password');
    const ismatched=await user.comparePassword(req.body.oldPassword);
    if(!ismatched){
        return next(new ErrorHandeler(`old password is incorrect`));

    }
    user.password=req.body.password
    await user.save();
    sendToken(user,200,res)
})
//Update user Profile(user)
exports.updateUserProfile=catchAsyncError(async (req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        password:req.body.password
    }
    //avater will do,
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        seccess:true,
        user
    })
})
//Get all User for admin
exports.allUsers=catchAsyncError(async (req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        seccess:true,
        users
    })
})
//Get detail User for admin
exports.getUserdetaile=catchAsyncError(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandeler(`User dose not found with id:${req.params.id}`))
    }
    res.status(200).json({
        seccess:true,
        user
    })
})
//update user profile (admin work)
exports.updateUserStatus=catchAsyncError(async (req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    //avater will do,
    const user=await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        seccess:true,
        user
    })
})
//delate User(admin work)
exports.delateUser=catchAsyncError(async (req,res,next)=>{
    const user=await User.findById(req.params.id);
    if(!user){
        return next(new ErrorHandeler(`User dose not found with id:${req.params.id}`))
    }
    await user.remove();

    res.status(200).json({
        seccess:true,
       
    })
})