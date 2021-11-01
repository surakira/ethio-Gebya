const express=require('express');
const router=express.Router();
const {isAuthenticatedUser,authrizeRoles}=require('../middlewares/auth')
const {newOrder,getSingleOrder,myOrder
,allOreder,updateOrder,deletOrders}=require('../controlers/orderControler');
router.route('/order/new').post(isAuthenticatedUser,newOrder);
router.route('/order/me').get(isAuthenticatedUser,myOrder);
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder)
router.route('/orders').get(isAuthenticatedUser,authrizeRoles('admin'),allOreder)
router.route('/order/admin/:id')
                        .put(isAuthenticatedUser,authrizeRoles('admin'),updateOrder)
                        .delete(isAuthenticatedUser,authrizeRoles('admin'),deletOrders)
module.exports=router