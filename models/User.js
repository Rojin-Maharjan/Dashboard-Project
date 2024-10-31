const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userName:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String, required:true},
    password:{type:String, required:true},
    logoUrl:{type:String, required:true},
    logoId:{type:String, required:true},
    position:{type:String, required:true},
},{timestamps:true})

module.exports = mongoose.model('User',userSchema);