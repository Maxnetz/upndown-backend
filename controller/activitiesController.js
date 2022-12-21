import Activity from "../models/activity.js";
import { StatusCodes } from "http-status-codes";
import {
    BadRequestError,
    UnAuthenticatedError,
    NotFoundError,
} from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";

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
    if (
        !activityName ||
        !activityType ||
        !startDate ||
        !endDate ||
        !duration ||
        !description
    ) {
        throw new BadRequestError("Please provide all values");
    }
    req.body.createdBy = req.user.userId;
    const activity = await Activity.create(req.body);
    res.status(StatusCodes.CREATED).json({ activity });
};

const deleteActivity = async (req, res) => {
    const { id: activityId } = req.params;
    const activity = await Activity.findOne({ _id: activityId });

    if (!activity) {
        throw new NotFoundError(`No activity with id: ${activityId}`);
    }

    checkPermissions(req.user, activity.createdBy);

    await activity.remove();
    res.status(StatusCodes.OK).json({ msg: "Success! Activity removed!" });
};

const getAllActivities = async (req, res) => {
    const activities = await Activity.find({ createdBy: req.user.userId });
    res.status(StatusCodes.CREATED).json({
        activities,
        totalActivities: activities.length,
        numOfPage: 1,
    });
};

const updateActivity = async (req, res) => {
    const { id: activityId } = req.params;
    const {
        activityName,
        activityType,
        startDate,
        endDate,
        duration,
        description,
    } = req.body;

    if (
        !activityName ||
        !activityType ||
        !startDate ||
        !endDate ||
        !duration ||
        !description
    ) {
        throw new BadRequestError("Please provide all values");
    }
    const activity = await Activity.findOne({ _id: activityId });

    if (!activity) {
        throw new NotFoundError(`No activity with id ${activityId}`);
    }
    // check Permission
    console.log(typeof req.user.userId);
    console.log(typeof activity.createdBy);

    checkPermissions(req.user, activity.createdBy);

    const updatedActivity = await Activity.findOneAndUpdate(
        { _id: activityId },
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    // Alternative Approach
    // activity.activityName = activityName;
    // activity.activityType = activityType;
    // activity.startDate = startDate;
    // activity.endDate = endDate;
    // activity.duration = duration;
    // activity.description = description;
    // await activity.save();

    res.status(StatusCodes.OK).json({ updatedActivity });
};

const showStats = async (req, res) => {
    let stats = await Activity.aggregate([
        { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: "$activityType", count: { $sum: 1 } } },
        { $count: "count" },
    ]);

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr;
        acc[title] = count;
        return acc;
    }, {});

    const defaultStats = {
        totalActivities: stats.undefined,
    };

    res.status(StatusCodes.OK).json({ defaultStats });
};

export {
    createActivity,
    deleteActivity,
    getAllActivities,
    updateActivity,
    showStats,
};
