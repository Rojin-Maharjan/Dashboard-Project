const express = require('express');
const Router = express.Router();
const bcrypt = require('bcrypt');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
const User = require('../models/User')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});

Router.post('/signup', async(req,res)=>{
    try {
        const users = await User.find({email:req.body.email})
        if(users.length>0){
            return res.status(500).json({
                error: 'email already taken'
            })
        }
        const hashCode = await bcrypt.hash(req.body.password,10)
        const uploadedImage = await cloudinary.uploader.upload(req.files.logo.tempFilePath)
        
        const newUser = new User({
            _id:new mongoose.Types.ObjectId,
            userName:req.body.userName,
            email:req.body.email,
            phone:req.body.phone,
            password:hashCode,
            position:req.body.position,
            logoUrl:uploadedImage.secure_url,
            logoId:uploadedImage.public_id
        })

        const user = await newUser.save()
        res.status(200).json({
            newUser: user
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})

Router.post('/login',async (req,res)=>{
    try{
        // console.log(req.body)
        const users = await User.find({email:req.body.email})
        // console.log(users)
        //check for email
        if(users.length == 0){
            return res.status(500).json({
                error: 'User cannot be found using this email'
            })
        }
        //check password
        const passAuth = await bcrypt.compare(req.body.password, users[0].password)
        // console.log(passAuth)
        if(!passAuth){
            return res.status(500).json({
                error: 'Invalid password'
            })
        }
        const token = jwt.sign({
            _id:users[0]._id,
            userName:users[0].userName,
            email:users[0].email,
            phone:users[0].phone,
            position:users[0].position,
            logoId:users[0].logoId
        },
        'dashboardKey',
        {expiresIn: '365d'}
    )
        res.status(200).json({
            _id:users[0]._id,
            userName:users[0].userName,
            email:users[0].email,
            phone:users[0].phone,
            position:users[0].position,
            logoId:users[0].logoId,
            logoUrl:users[0].logoUrl,
            token: token
        })
    }
    catch(err){
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})

module.exports = Router