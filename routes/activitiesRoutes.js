import express from "express";
const router = express.Router();

import {
    createActivity,
    deleteActivity,
    getAllActivities,
    updateActivity,
    showStats,
} from "../controller/activitiesController.js";


router.route("/").post(createActivity).get(getAllActivities);
// remember about id
router.route("/stats").get(showStats);

router.route("/:id").delete(deleteActivity).patch(updateActivity);

export default router;
