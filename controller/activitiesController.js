import Activity from "../models/activity.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";

const createActivity = async (req, res) => {
    // res.send("create activity");
    const {
        activityName,
        activityType,
        startDate,
        endDate,
        duration,
        description,
    } = req.body;

    //Activity required
    if (!activityName || !activityType || !startDate || !endDate || !duration ||
        !description) {
        throw new BadRequestError("Please provide all values");
    }
    req.body.createdBy = req.user.userId;
    const activity = await Activity.create(req.body);
    res.status(StatusCodes.CREATED).json({ activity });
};
const deleteActivity = async (req, res) => {
    res.send("Delete Activity");
};
const getAllActivities = async (req, res) => {
    const activities = await Activity.find({createdBy: req.user.userId})
    console.log(activities);
    res.status(StatusCodes.CREATED).json({activities, totalActivities: activities.length, numOfPage: 1});
};
const updateActivity = async (req, res) => {
    res.send("Update Activity");
};
const showStats = async (req, res) => {
    res.send("Show Activity");
};

export {
    createActivity,
    deleteActivity,
    getAllActivities,
    updateActivity,
    showStats,
};
