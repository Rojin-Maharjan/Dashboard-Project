const express = require('express')
const app = express();
const mongoose = require('mongoose')
const userRoute = require('./routes/user')
const projectRoute = require('./routes/projects')
const bodyParser = require('body-parser')
require('dotenv').config()
const fileUpload = require('express-fileupload')

// mongoose.connect(process.env.MONGO_URI)
// .then(res=>
//     console.log('Connected to database...')
// )
// .catch(err=>
//     console.log(err)
// )    

const connectWithMongoDb = async()=>{
    try{
        const res = await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected to database')
    }
    catch(err){
        console.log(err)
    }
}
connectWithMongoDb()


app.use(bodyParser.json())
app.use(fileUpload({
    useTempFiles : true,
    // tempFileDir : '/tmp/'
}));
app.use('/user',userRoute)
app.use('/projects',projectRoute)

module.exports = app;