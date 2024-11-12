const Projects = require('../models/Projects')
const mongoose = require('mongoose')

const projectList = Projects.find()
.then(projectList => res.json(projectList))
.catch(err => res.json(err))