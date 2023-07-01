const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reportgen=new Schema(
{
    url:{
        type:String,
        required: true
    },
    filename:{
        type:String,
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,

      required: true
    }

})
module.exports=mongoose.model('generatedreports',reportgen)