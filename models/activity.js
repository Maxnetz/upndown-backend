import mongoose from "mongoose";
const Schema = mongoose.Schema;

let activitySchema = new Schema(
    {
        activityName: {
            type: String,
            maxlength: 50,
            required: [true, "Please provide activity name"],
        },
        activityType: {
            type: String,
            enum: ["","Walking", "Running", "Swimming", "Riding", "Hiking"],
            default: "",
            required: [true, "Please provide activity type"],
        },
        startDate: {
            type: String,
            required: [true, "Please provide Start Date"],
        },
        endDate: {
            type: String,
            required: [true, "Please provide End Date"],
        },
        duration: {
            type: String,
            // default: "00:00:00",
        },
        description: {
            type: String,
            maxlength: 50,
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please provide user"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
