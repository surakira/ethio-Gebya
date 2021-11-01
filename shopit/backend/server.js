const app=require('./app')
const bodyParser=require("body-parser")
const dotenv=require('dotenv')
const connectDatabase=require('./config/database')
const { path } = require('./app')
dotenv.config({path: 'backend/config/config.env'})
//handling Uncaught exptions
process.on('uncaughtException',err=>{
    console.log(`ERROR:${err.stack}`);
    console.log("shuting down because of un handeled exptions")
})
connectDatabase();
const server=app.listen(process.env.PORT,()=>{
    console.log(`Server started on PORt:${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

//handling hun handeldelrejection
process.on('unhandledRejection',err=>{
    console.log(`ERROR:${err.stack}`);
    console.log("shutingdown the server due tor unhandeled Promise rejection");
    server.close(()=>{
        process.exit(1)
    })
})