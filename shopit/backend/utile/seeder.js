const Product=require('../model/product');
const dotenv=require('dotenv');
const connectDatabase=require('../config/database');
const products= require('../data/products');
dotenv.config({path:'backend/config/config.env'})
connectDatabase();
const seedProduct=async ()=>{
    try{
 await Product.deleteMany();
 console.log("product are delated")
 await Product.insertMany(products);
 console.log("product are inserted");
   process.exit()
    }catch(error){
        console.log(error.message);
        process.exit();
    }
}
seedProduct()