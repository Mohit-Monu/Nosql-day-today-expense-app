const mongoose = require('mongoose');
const Schema = mongoose.Schema
const Order=new Schema(
{
    paymentid:{
        type:String,
        required: true
    },
    orderid:{
        type:String,
        required: true
    },
    status:{
        type:String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,

      required: true
    }

})
module.exports=mongoose.model('order',Order)