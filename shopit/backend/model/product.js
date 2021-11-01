const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxlength:[100,'product can not exeed 100 charachter'],
    },
    price:{
        type:Number,
        required:[true,"pleas enter the product"],
        default:0.0,
        maxlength:[5,'product can not exeed 5charachter'],  

    },
    description:{
        type:String,
       required:[true,"pleas enter the product"],
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                required:[true,'pleas enter']
            },
            url:{
                type:String,
                required:[true,'pleas enter']
            }
        } 
     ],
     category:{
         type:String,
         required:[true,"pleas enter the catagory"]
        ,enum:
            {
                values:
        [ 
        'Electronics',
        'Cameras',
        'Laptops',
        'Accessories',
        'Headphones',
        'Food',
        'Books',
        'Clothes/Shoes',
        'Beauty/Health',
        'Sports',
        'Outdoor',
        'Home'

        ] 
        ,Message:"pleas select correct catagory"
    }
        
         },
         seller:{
            type:String,
            required:[true,'please enter product seller']

         },
         stock:{
             type:Number,
            required:[true,'plase enter product in stock'],
             maxlength:[5,'product name must lessthan 5 character']
             ,default:0
            },
        numOfReviews:{
          type:Number,
          default:0
            },
            reviews:[
                {
                    user:{
                        type:mongoose.Schema.ObjectId,
                        ref:'User',
                        required:true
                    },
                    name:{
                       type:String,
                       
                    },rating:{
                        type:Number,
                        
                    },
                    comment:{
                        type:String,
                       
                     },
                }
            ],
            user:{
                type:mongoose.Schema.ObjectId,
                ref:'User',
                required:true
            },
            createdAt:{
                type:Date,
                default:Date.now
            
            }
})
module.exports=mongoose.model('Product',productSchema)