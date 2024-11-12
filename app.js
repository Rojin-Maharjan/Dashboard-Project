const express = require('express')
const app = express();
const mongoose = require('mongoose')
const userRoute = require('./routes/user')
const projectRoute = require('./routes/projects')
const projectListRoute = require('./routes/projectList')
const bodyParser = require('body-parser')
require('dotenv').config()
const fileUpload = require('express-fileupload')
const cors = require('cors')   

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

app.use(cors())
app.use(bodyParser.json())
app.use(fileUpload({
    useTempFiles : true,
    // tempFileDir : '/tmp/'
}));
app.use('/user',userRoute)
app.use('/projects',projectRoute)
app.get('/projects',projectListRoute)

module.exports = app;