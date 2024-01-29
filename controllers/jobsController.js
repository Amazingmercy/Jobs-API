const Jobs = require('../models/jobModel')
const {BadRequestError, NotFoundError} = require('../errors')
const {StatusCodes} = require('http-status-codes')

const getAllJobs = async(req, res) => {
    const userId = req.user.userId
    const jobs = await Jobs.find({ createdBy: userId }).sort('createdAt');
    res.status(StatusCodes.OK).json({count: jobs.length, jobs})
}

const getJob = async(req, res) => {
    const jobId = req.params.id
    const userId = req.user.userId
    const job = await Jobs.findOne({_id: jobId, createdBy: userId})

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}


const createJob = async(req, res) => {
    req.body.createdBy = req.user.userId
    const jobs = await Jobs.create({...req.body})
    res.status(StatusCodes.CREATED).json(jobs)
}

const updateJob = async(req, res) => {
    const jobId = req.params.id
    const userId = req.user.userId
    const {position, company} = req.body
    if(company === "" || position === ""){
        throw new BadRequestError("Company name and position fields cannot be empty!")
    }
    const job = await Jobs.findOneAndUpdate({_id: jobId, createdBy: userId}, req.body, {new:true, runValidators: true})

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const deleteJob = async(req, res) => {
    const jobId = req.params.id
    const userId = req.user.userId
    const job = await Jobs.findOneAndDelete({_id: jobId, createdBy: userId})

    if(!job){
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json(`Job with id ${jobId} Deleted successfully!`)
}


module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}