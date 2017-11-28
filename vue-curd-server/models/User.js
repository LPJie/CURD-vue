/**
 * Created by Administrator on 2017/11/2.
 */
const mongoose = require('mongoose')
const shortid = require('shortid')
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    _id:{
        type:String,
        default:shortid.generate
    },
    username:{
        type:String,
        required:true
    },
    name:{
        type:String
    },
    password:{
        type:String,
    },
    tel:{
        type:Number
    },
    email:{
        type:String
    },
    create_time:{
        type:Date,
        default:Date.now
    },
    is_active:{
        type:Boolean,
        default:false
    }
})
module.exports = mongoose.model('User',UserSchema)