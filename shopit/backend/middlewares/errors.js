const ErrorHandeler=require('../utile/errorHandler');
module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
   if(process.env.NODE_ENV=="DEVELOPMENT"){
       res.status(err.statusCode).json({
           seccess:false,
           error:err,
           errMessage:err.message,
           stack:err.stack
       })
   }
    if(process.env.NODE_ENV="PRODUCTION"){
      let error={...err}
      error.message=err.message
      //wrong mongoose object id Error
      if(err.name=='CastError'){
          const message=`Resource not found.Invalid:${err.path}`
          error=new ErrorHandeler(message,400)
      }
      //Handeling Mongoose Validation Error
      if(err.name==='validationError'){
          const message=Object.values(err.errors).map(value=>value.message);
          error=new ErrorHandeler(message,400)
      }
      res.status(error.statusCode).json({
          seccess:false,
          message:error.message||'Internal Server Error'
      })  
    }
}