const express = require('express')
const bodyparser=require("body-parser")
const app=express();
const errorMiddleware=require('./middlewares/errors')
const cookieParser=require('cookie-parser')
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(cookieParser())
const products=require('./routs/product')
const auth=require('./routs/auth')
const order=require('./routs/order')
app.use('/api/v1',products);
app.use('/api/v1/',auth)
app.use('/api/v1',order)
app.use(errorMiddleware)
module.exports=app