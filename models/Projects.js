const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String, required:true},
    views:{type:Number, default:0},
    thumbnailUrl:{type:String, required:true},
    thumbnailId:{type:String, required:true},
    pageUrl:{type:String, required:true},
    user_id:{type:String, required:true}
},{timestamps:true})

module.exports = mongoose.model('Project',projectSchema);