const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String, required:true},
    thumbnailUrl:{type:String, required:true},
    thumbnailId:{type:String, required:true},
    pageUrl:{type:String, required:true},
    user_id:{type:String, required:true},
    likes:{type:Number, default:0},
    dislikes:{type:Number, default:0},
    likedby:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    dislikedby:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
},{timestamps:true})

module.exports = mongoose.model('Project',projectSchema);