const express=require('express');
const router=express.Router();
const {registerUser,loginUser,
    logout,allUsers,getUserProfile,updatePassword,
    updateUserProfile,getUserdetaile,
    updateUserStatus,
    delateUser}=require('../controlers/authController');
const { isAuthenticatedUser, authrizeRoles } = require('../middlewares/auth');
router.route('/register').post(registerUser);
router.route('/login').post(loginUser)
router.route('/logout').get(logout)
router.route('/me').get(isAuthenticatedUser,getUserProfile)
router.route('/updatePassword').put(isAuthenticatedUser,updatePassword)
router.route('/me/updateMeProfile').put(isAuthenticatedUser,updateUserProfile)
router.route('/admin/allUsers').get(isAuthenticatedUser,authrizeRoles('admin'),allUsers)
router.route('/admin/getUserDetail/:id').get(isAuthenticatedUser,authrizeRoles('admin'),getUserdetaile)
router.route('/admin/updateUser/:id').put(isAuthenticatedUser,authrizeRoles('admin'),updateUserStatus)
router.route('/admin/delateUser/:id/').delete(isAuthenticatedUser,authrizeRoles('admin'),delateUser)
module.exports=router;
