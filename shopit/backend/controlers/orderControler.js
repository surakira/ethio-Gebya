const Order=require('../model/order');
const Product=require('../model/product');
const ErrorHandeler=require('../utile/errorHandler');
const catchAsyncError=require('../middlewares/catchAsync');
exports.newOrder=catchAsyncError(async (req,res,next)=>{
 const {orderItems,shippingInfo,itemsPrice,
 taxPayment,shippingPrice,
 totalPrice,
 paymentaInfo
}=req.body
const order=await Order.create({
    orderItems,shippingInfo,itemsPrice,
    taxPayment,shippingPrice,
    totalPrice,
    paymentaInfo,
    paidAt:Date.now(),
    user:req.user._id

})
res.status(200).json({
    seccess:true,
    order
})
})
//Get sngel Order
exports.getSingleOrder=catchAsyncError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id).populate('user','name email');

    if(!order){
        return next(new ErrorHandeler('no order find in thid Id',404))
    }
    res.status(200).json({
        seccess:true,
        order
    })
})
//get single logedin user order
exports.myOrder=catchAsyncError(async (req,res,next)=>{
    const order=await Order.find({user:req.user.id})

    if(!order){
        return next(new ErrorHandeler('no order find in thid Id',404))
    }
    res.status(200).json({
        seccess:true,
        order
    })
})
//get all Orders (admin work)
exports.allOreder=catchAsyncError(async (req,res,next)=>{
    const orders=await Order.find()
    let totalAmount=0;
    orders.forEach(order=>{
   totalAmount+=order.totalPrice;
    })
    res.status(200).json({
        seccess:true,
        totalAmount,
        orders

    })
})
//update/process order_Admin
exports.updateOrder=catchAsyncError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id);

   if(order.orderStatus==='Delivered'){
       next(new ErrorHandeler('you have alredy deliverd',400));

   }
   order.orderItems.forEach(async item=>{
         await updateStock(item.product,item.quantity) 
        })
        order.orderStatus=req.body.status,
        order.deliveredAt=Date.now();
        await order.save();
    res.status(200).json({
        seccess:true,  

    })
})
async function updateStock(id,quantity){
    const product=await Product.findById(id)
    product.stock=product.stock-quantity;
    await product.save({validateBeforeSave:false})
}
//Delet Orders(Admin work)
exports.deletOrders=catchAsyncError(async (req,res,next)=>{
    const order=await Order.findById(req.params.id)
    
    if(!order){
        return next(new ErrorHandeler('no order find in thid Id',404))
    }
    await order.remove()
    res.status(200).json({
        seccess:true,
       
    })
})