const express=require('express');
const router=express.Router();
const {isAuthenticatedUser,authrizeRoles}=require('../middlewares/auth')
const { getProducts,newProducts,getSingleProducts,updateProduct,DelateProducts,createProductReview,
    getProductReviews,deleteReview}=require('../controlers/productController')
router.route('/products').get(getProducts);
router.route('/admin/product/new').post(isAuthenticatedUser,authrizeRoles('admin'),newProducts);
router.route('/product/:id').get(getSingleProducts);
router.route('/admin/product/:id')
                        .put(isAuthenticatedUser,authrizeRoles('admin'),updateProduct)
                        .delete(isAuthenticatedUser,authrizeRoles('admin'),DelateProducts)
router.route('/review/update').put(isAuthenticatedUser,createProductReview)
router.route('/reviews').get(isAuthenticatedUser,getProductReviews)
                        .delete(deleteReview)                        
module.exports=router;