const express = require('express')
const Router = express.Router()
const checkAuth = require('../middleware/checkAuth')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose')
const Projects = require('../models/Projects')



cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});

Router.get('/list', async(req, res) => {
        Projects.find()
        .then(projects => res.json(projects))
        .catch(err => res.json(err))
})

Router.post('/upload', checkAuth,async (req,res)=>{
    try {
        const token = req.headers.authorization.split(" ")[1]
        const user = await jwt.verify(token, 'dashboardKey')
        const projectThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
        console.log(projectThumbnail)
        const newProject = new Projects({
            _id:new mongoose.Types.ObjectId,
            title:req.body.title,
            user_id:user._id,
            thumbnailUrl:projectThumbnail.secure_url,
            thumbnailId:projectThumbnail.public_id,
            pageUrl:req.body.pageUrl
        }) 
        const postedProject = await newProject.save()
        res.status(200).json({
            newProject:postedProject
        })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})
//project update api
Router.put('/:projectsId', checkAuth,async (req,res)=>{
    try {
        const verifyToken = await jwt.verify(req.headers.authorization.split(" ")[1], 'dashboardKey')
        const projectInfo = await Projects.findById(req.params.projectsId)
        if(projectInfo.user_id == verifyToken._id){
            //update project
            if(req.files){
                //update thumbnail and texts data
                await cloudinary.uploader.destroy(projectInfo.thumbnailId)
                const updatedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath)
                console.log(updatedThumbnail)
                const updatedData = {
                    title:req.body.title, 
                    thumbnailUrl:updatedThumbnail.secure_url,
                    thumbnailId:updatedThumbnail.public_id
                }
                const updatedProject = await Projects.findByIdAndUpdate(req.params.projectsId,updatedData,{new:true})
                res.status(200).json({
                    updatedProject: updatedProject
                })
            }
                
            else{
                const updatedData = {
                    title:req.body.title
                }
                const updatedProject = await Projects.findByIdAndUpdate(req.params.projectsId,updatedData,{new:true})
                res.status(200).json({
                    updatedProject: updatedProject
                })
            }
        }
        else{
            return res.status(500).json({
                error: 'Permission declined'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})
//delete project
Router.delete('/:projectsId', checkAuth,async (req,res)=>{
    try {
        const verifyToken = await jwt.verify(req.headers.authorization.split(" ")[1], 'dashboardKey')
        console.log(verifyToken)
        const projectInfo = await Projects.findById(req.params.projectsId)
        if(projectInfo.user_id == verifyToken._id){
            //delete code
            await cloudinary.uploader.destroy(projectInfo.thumbnailId)
            const deletedRes = await Projects.findByIdAndDelete(req.params.projectsId)
            res.status(200).json({
                deletedResponse: deletedRes
            })
        }
        else{
            return res.status(500).json({
                error:'invalid access'
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})
//views api
Router.put('/views/:projectId', async(req, res)=>{
    try {
       const project = await Projects.findById(req.params.projectId)
       project.views += 1;
       await project.save()
       console.log(project)
       res.status(200).json({
        msg: 'viewed'
       })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            error: err
        })
    }
})

module.exports = Router