const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcryptjs')
const crypto=require('crypto')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'pleas enter your name'],
        maxlength:[100,"your name can not exeed 30 charachter"],
    },
    email:{
        type:String,
        required:[true,'pleas enter your email'],
        unique:true,
        validate:[validator.isEmail,'pleas enter you email correctly']
    },
    password:{
        type:String,
        required:[true,'pleas enter your password'],
        minlength:[6,'your password not more than 6 characher'],
        select:false
    } ,
    avater:{
        public_id:{
            type:String,
            required:[true,'pleas enter']
        },
        url:{
            type:String,
            required:[true,'pleas enter']
        }
    },
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date

})
//encript password
userSchema.pre('save',async function(next){
   if(!this.isModified('password')){
       next()
   }
   this.password=await bcrypt.hash(this.password,10)
})
//Compare user password
userSchema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
//Generate password reset token
userSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken=crypto.createHash('she256').update(resetToken).digest
    this.resetPasswordExpire=Date.now()+30+60+1000
    return resetToken; 
} 
//Genrate jwt token
userSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME
    })
}
module.exports=mongoose.model('User',userSchema)