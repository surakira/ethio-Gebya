//const { remove } = require("../model/product");
const ErrorHandeler=require("../utile/errorHandler")
const catchAsyncError=require("../middlewares/catchAsync")
const Product = require("../model/product");
const APIFeatures=require("../utile/apiFeatures")
const { connections } = require("mongoose");
//get all product
exports.getProducts=catchAsyncError ( async (req,res,next)=>{
    const resPerPage=4;
    const productCount=await Product.countDocuments() 
    const apiFeatures=new APIFeatures(Product.find(),req.query)
                          .search()
                          .filter()
                        .pagination(resPerPage);
                          const products=await apiFeatures.query;
    res.status(200).json({
        success:true,
        productCount,
        count:products.length,
        products
    })
     console.log(products)
})
//add single product
exports.getSingleProducts= catchAsyncError (async (req,res,next)=>{
    const products=await Product.findById(req.params.id);
     if(!products){
       return next(new ErrorHandeler('product not found',404))
        }
        res.status(200).json({    
            success:true,
            
            products
        })      
     })
    

//add new product
exports.newProducts= catchAsyncError (async (req,res,next)=>{
req.body.user=req.user.id
const product = await Product.create(req.body);
res.status(200).json({
    sucesse:true,
    product
})
})
//update products
exports.updateProduct= catchAsyncError ( async (req,res,next)=>{
    const products=await Product.findById(req.params.id);
    if(!products){
        return next(new ErrorHandeler('product not found',404))
         }
         const product=await Product.findByIdAndUpdate(req.params.id,req.body,{
             new:true,
             runValidators:true,
             useFindAndModify:false
         });
         res.status(200).json({
             success:true,
             product
         })
})
//Delate Products
exports.DelateProducts= catchAsyncError ( async (req,res,next)=>{
    const products=await Product.findById(req.params.id)
    if(!products){
        return next(new ErrorHandeler('product not found',404))
         }
         const product=await Product.findByIdAndDelete(req.params.id);
         res.status(200).json({
            success:true,
            message:"product Delated",
            product
        })

})
//Creat new Reviews
exports.createProductReview=catchAsyncError(async(req,res,next)=>{
    const {rating,comment,productId}=req.body
    const review={
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product=await Product.findById(productId);
    const isReviewed=product.reviews.find(
        r=>r.user.toString()===req.user._id.toString()
    ) 
    console.log(product.reviews)
   if(isReviewed){
       product.reviews.forEach(review=>{
           if(review.user.toString()===req.user._id.toString()){
               review.comment=comment;
               review.rating=rating;
           }
       })
   }
   else{
       product.reviews.push(review);
       product.numOfReviews=product.reviews.length
   } 
   product.ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/product.reviews.length
   await product.save({validateBeforeSave:false})
   res.status(200).json({
       success:true
   })
})
//get product Reviews
exports.getProductReviews=catchAsyncError(async (req,res,next)=>{
    const product =await Product.findById(req.query.id);
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})
//Delete Product Review
exports.deleteReview=catchAsyncError(async (req,res,next)=>{
    const product =await Product.findById(req.query.productId);
    const reviews=product.reviews.filter(review=>review._id.toString()!==req.query.id.toString())
    const ratings=product.reviews.reduce((acc,item)=>item.rating+acc,0)/reviews.length
    const numOfReviews=reviews.length;
    await Product.findByIdAndUpdate(req.query.id,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        reviews:product.reviews
    })
})